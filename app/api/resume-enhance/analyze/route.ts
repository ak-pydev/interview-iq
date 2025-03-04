import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getAuth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Augment the NodeJS global type to include our cached promise.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

interface AnalyzeRequest {
  userId?: string;
  fileUrl: string;
  jobDescription: string;
  companyName: string;
  targetRole: string;
}

// Structure for the response that matches our UI expectations
interface StructuredAnalysisResponse {
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  keywords: {
    present: string[];
    missing: string[];
  };
  formatting: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Retrieve the authenticated user ID from Clerk.
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Parse the request body.
    const body: AnalyzeRequest = await request.json();
    const { fileUrl, jobDescription, companyName, targetRole } = body;
    if (!fileUrl || !jobDescription || !companyName || !targetRole) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Extract the file ID from the fileUrl robustly.
    const urlObj = new URL(fileUrl, request.url);
    const pathSegments = urlObj.pathname.split('/');
    const fileId = pathSegments[pathSegments.length - 1];
    if (!fileId) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }

    // Connect to the database.
    const client = await clientPromise;
    const db = client.db('propelcareerai-db');

    // Retrieve the file document from the uploads collection.
    const uploadsCollection = db.collection('resume-enhancer-uploads');
    const fileDoc = await uploadsCollection.findOne({
      _id: new ObjectId(fileId),
      userId
    });
    if (!fileDoc) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Convert file data to Base64.
    const fileBuffer = fileDoc.fileData.buffer ? fileDoc.fileData.buffer : fileDoc.fileData;
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');

    // Determine MIME type based on file extension.
    const fileName = fileDoc.fileName || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let mimeType = "application/pdf"; // Default to PDF.
    if (fileExtension === 'docx') {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (fileExtension === 'doc') {
      mimeType = "application/msword";
    }

    // Verify that the Gemini API key is available.
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    // Initialize the Gemini generative model.
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build a comprehensive prompt for resume analysis with a structured output format.
    const promptText = `
Analyze this resume for a ${targetRole} position at ${companyName} against the following job description:

JOB DESCRIPTION:
${jobDescription}

FORMAT YOUR RESPONSE IN THE FOLLOWING STRUCTURE:

1. MATCH PERCENTAGE:
   Match score: [0-100]%

2. STRENGTHS:
   - Strength: [Specific strength aligned with job]
   - Strength: [Specific strength aligned with job]
   - Strength: [Specific strength aligned with job]
   (List 3-5 strengths)

3. IMPROVEMENTS:
   - Improve: [Specific, actionable improvement suggestion]
   - Improve: [Specific, actionable improvement suggestion]
   - Improve: [Specific, actionable improvement suggestion]
   (List 3-5 improvements)

4. KEYWORDS:
   - Present: [keyword from job description found in resume]
   - Missing: [important keyword missing from resume]
   (List all relevant keywords)

5. FORMATTING:
   - [Specific formatting suggestion]
   - [Specific formatting suggestion]
   (List 2-3 suggestions)

Be direct, specific and actionable with your feedback. Use EXACTLY the format above with the exact prefixes shown.
`;

    // Call Gemini API.
    const result = await model.generateContent([
      { inlineData: { data: fileBase64, mimeType } },
      promptText,
    ]);
    if (!result.response || !result.response.text) {
      return NextResponse.json({ error: "No feedback received from Gemini." }, { status: 500 });
    }
    const rawResponse = typeof result.response.text === 'function'
      ? await result.response.text()
      : result.response.text;

    // Parse Gemini response into structured format
    const structuredResponse = parseGeminiResponseStructured(rawResponse);

    // Update the original file document with analysis details.
    await uploadsCollection.updateOne(
      { _id: new ObjectId(fileId) },
      { 
        $set: { 
          analysis: { 
            ...structuredResponse,
            createdAt: new Date() 
          } 
        } 
      }
    );

    // Also save analysis into a dedicated collection.
    const analysisCollection = db.collection('resume-enhancer-analysis');
    await analysisCollection.insertOne({
      userId,
      fileId,
      jobDescription,
      companyName,
      targetRole,
      ...structuredResponse,
      createdAt: new Date()
    });

    // Return the structured response that matches our UI expectations
    return NextResponse.json({
      success: true,
      ...structuredResponse,
      // Include combined feedback array for backward compatibility
      feedback: [
        ...structuredResponse.strengths,
        ...structuredResponse.improvements,
        ...structuredResponse.formatting,
        ...structuredResponse.keywords.present.map(k => `Present keyword: ${k}`),
        ...structuredResponse.keywords.missing.map(k => `Missing keyword: ${k}`),
      ]
    });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Parses the Gemini response into a structured format that matches our UI expectations.
 */
function parseGeminiResponseStructured(rawResponse: string): StructuredAnalysisResponse {
  const normalized = rawResponse.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  
  // Initialize structured response
  const structuredResponse: StructuredAnalysisResponse = {
    matchPercentage: 65, // Default match percentage
    strengths: [],
    improvements: [],
    keywords: {
      present: [],
      missing: [],
    },
    formatting: [],
  };

  // Extract match percentage
  const matchRegex = /match score:\s*(\d+)%/i;
  for (const line of lines) {
    const matchMatch = line.match(matchRegex);
    if (matchMatch && matchMatch[1]) {
      const score = parseInt(matchMatch[1], 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        structuredResponse.matchPercentage = score;
        break;
      }
    }
  }

  // Extract other sections
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Extract strengths
    if (trimmed.startsWith('Strength:') || trimmed.startsWith('- Strength:')) {
      const strength = trimmed.replace(/^(-\s*)?Strength:\s*/i, '').trim();
      if (strength.length > 0) {
        structuredResponse.strengths.push(strength);
      }
    }
    // Extract improvements
    else if (trimmed.startsWith('Improve:') || trimmed.startsWith('- Improve:')) {
      const improvement = trimmed.replace(/^(-\s*)?Improve:\s*/i, '').trim();
      if (improvement.length > 0) {
        structuredResponse.improvements.push(improvement);
      }
    }
    // Extract present keywords
    else if (trimmed.startsWith('Present:') || trimmed.startsWith('- Present:')) {
      const keyword = trimmed.replace(/^(-\s*)?Present:\s*/i, '').trim();
      if (keyword.length > 0) {
        structuredResponse.keywords.present.push(keyword);
      }
    }
    // Extract missing keywords
    else if (trimmed.startsWith('Missing:') || trimmed.startsWith('- Missing:')) {
      const keyword = trimmed.replace(/^(-\s*)?Missing:\s*/i, '').trim();
      if (keyword.length > 0) {
        structuredResponse.keywords.missing.push(keyword);
      }
    }
    // Extract formatting suggestions
    else if (trimmed.match(/^(-\s*)?\[?Formatting/i) || 
             (trimmed.startsWith('-') && 
              !trimmed.includes('Strength:') && 
              !trimmed.includes('Improve:') && 
              !trimmed.includes('Present:') && 
              !trimmed.includes('Missing:') && 
              lines.some(l => l.includes('FORMATTING')))) {
      const formatting = trimmed.replace(/^-\s*/, '').trim();
      if (formatting.length > 0 && !formatting.match(/^[A-Z\s]+:$/)) {
        structuredResponse.formatting.push(formatting);
      }
    }
  }

  // Provide default values if sections are empty
  if (structuredResponse.strengths.length === 0) {
    structuredResponse.strengths.push('Your resume has a professional structure');
  }
  
  if (structuredResponse.improvements.length === 0) {
    structuredResponse.improvements.push('Consider tailoring your resume more specifically to the job description');
  }

  return structuredResponse;
}