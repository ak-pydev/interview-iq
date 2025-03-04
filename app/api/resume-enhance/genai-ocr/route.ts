<<<<<<< HEAD
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
  userId: string;
  fileUrl: string;
  jobDescription: string;
  companyName: string;
  targetRole: string;
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

    // Use the URL constructor to extract the file ID robustly.
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

    // Determine MIME type based on the file extension.
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    let mimeType = "application/pdf"; // Default.
=======
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileUrl, jobDescription, companyName, targetRole } = body;
    
    if (!fileUrl || typeof fileUrl !== 'string') {
      return NextResponse.json(
        { error: "fileUrl is required and must be a string." },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required for proper analysis." },
        { status: 400 }
      );
    }

    // Convert the relative URL to an absolute URL using the current request's URL as base.
    const absoluteUrl = new URL(fileUrl, request.url).toString();
    console.log("Absolute file URL:", absoluteUrl);

    // Fetch the file from the absolute URL.
    const fileRes = await fetch(absoluteUrl);
    console.log("Fetch file response status:", fileRes.status);
    if (!fileRes.ok) {
      const errText = await fileRes.text();
      console.error("Error fetching file:", errText);
      return NextResponse.json(
        { error: "Failed to fetch the PDF file from fileUrl." },
        { status: 400 }
      );
    }
    const arrayBuffer = await fileRes.arrayBuffer();
    const fileBase64 = Buffer.from(arrayBuffer).toString('base64');

    // Determine file type from URL or response headers
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    let mimeType = "application/pdf"; // Default to PDF
    
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
    if (fileExtension === 'docx') {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (fileExtension === 'doc') {
      mimeType = "application/msword";
    }

<<<<<<< HEAD
    // Verify that the Gemini API key is available.
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    // Initialize Gemini generative model.
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

    // Build a comprehensive prompt.
=======
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

    // Create a comprehensive prompt for rich resume analysis
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
    const promptText = `
I need a detailed analysis of this resume compared to the following job description for a ${targetRole} position at ${companyName}:

JOB DESCRIPTION:
${jobDescription}

Please provide a comprehensive analysis with the following sections:

1. MATCH PERCENTAGE:
<<<<<<< HEAD
   - Calculate an overall match percentage between the resume and job description.
   - Format as "Match score: X%" where X is a number between 0-100.

2. KEY STRENGTHS:
   - List 3-5 specific strengths from the resume that align well with the job requirements.
   - Start each with "Strength:" followed by a clear explanation.

3. IMPROVEMENT AREAS:
   - Identify 3-5 critical gaps or areas for improvement.
   - Start each with "Improve:" followed by specific, actionable suggestions.
   - Be direct and detailed about what should be changed.

4. KEYWORDS ANALYSIS:
   - Extract 5-10 important keywords from the job description.
   - Indicate which keywords are present in the resume and which are missing.
   - For missing keywords, suggest specific ways to incorporate them.

5. FORMATTING SUGGESTIONS:
   - Evaluate the resume's layout, organization, and visual structure.
   - Suggest specific improvements to enhance readability and impact.

Format each section with clear bullet points.
`;

    // Call Gemini API with inline file data and prompt.
=======
   - Calculate an overall match percentage between the resume and job description
   - Format as "Match score: X%" where X is a number between 0-100

2. KEY STRENGTHS:
   - List 3-5 specific strengths from the resume that align well with the job requirements
   - Start each with "Strength:" followed by a clear explanation

3. IMPROVEMENT AREAS:
   - Identify 3-5 critical gaps or areas for improvement
   - Start each with "Improve:" followed by specific, actionable suggestions
   - Be direct and detailed about what should be changed

4. KEYWORDS ANALYSIS:
   - Extract 5-10 important keywords from the job description
   - Indicate which keywords are present in the resume and which are missing
   - For missing keywords, suggest specific ways to incorporate them

5. FORMATTING SUGGESTIONS:
   - Evaluate the resume's layout, organization, and visual structure
   - Suggest specific improvements to enhance readability and impact

Format each section with clear bullet points. Be specific, actionable, and focused on maximizing the candidate's chances of securing an interview.
`;

    // Generate the content using the enhanced prompt
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBase64,
<<<<<<< HEAD
          mimeType,
=======
          mimeType: mimeType,
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
        },
      },
      promptText,
    ]);

    if (!result.response || !result.response.text) {
<<<<<<< HEAD
      return NextResponse.json({ error: "No feedback received from Gemini." }, { status: 500 });
    }

    // If the response text is a function, await it.
    const rawFeedback = typeof result.response.text === 'function'
      ? await result.response.text()
      : result.response.text;

    // Parse the raw Gemini response into an array of bullet points.
    const feedbackArray = parseGeminiResponse(rawFeedback);
    const matchPercentageParsed = parseMatchScore(rawFeedback);

    // Save the analysis into the database.
    const analysisCollection = db.collection('resume-enhancer-analysis');
    await analysisCollection.insertOne({
      userId,
      fileId,
      jobDescription,
      companyName,
      targetRole,
      feedback: feedbackArray,
      matchPercentage: matchPercentageParsed,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      feedback: feedbackArray,
      rawFeedback,
      matchPercentage: matchPercentageParsed
    });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
=======
      return NextResponse.json(
        { error: "No feedback received from Gemini." },
        { status: 500 }
      );
    }

    // Process the response to format it for structured display
    const rawFeedback = result.response.text();
    
    // Parse the raw feedback into an array of bullet points
    const feedbackArray = parseGeminiResponse(rawFeedback);

    return NextResponse.json({ 
      feedback: feedbackArray,
      rawFeedback: rawFeedback,
      analysisDate: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error in Gemini feedback endpoint:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
  }
}

/**
<<<<<<< HEAD
 * Extracts common keywords from the given text.
 */
function extractKeywords(text: string): string[] {
  const commonKeywords = [
    "leadership", "teamwork", "communication", "project management",
    "JavaScript", "TypeScript", "React", "Node.js", "MongoDB",
    "data analysis", "problem solving", "collaboration", "innovation"
  ];
  return commonKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Parses the Gemini raw response into an array of bullet points.
 * It normalizes line breaks, removes common bullet markers and numbering,
 * and filters out header-like lines.
 */
function parseGeminiResponse(rawResponse: string): string[] {
  const normalized = rawResponse.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  const bulletRegex = /^(\s*[-*•]\s+|\s*\d+[\.\)]\s+)?(.*)$/;
  const bulletPoints: string[] = [];

  for (let line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    if (/^[A-Z\s]+:$/.test(trimmedLine)) continue;
    const match = trimmedLine.match(bulletRegex);
    if (match) {
      const content = match[2].trim();
      if (content.length >= 5) {
        bulletPoints.push(content);
      }
    }
  }
  if (bulletPoints.length === 0) {
    return normalized.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 0);
  }
  return bulletPoints;
}

/**
 * Extracts the match score from the Gemini response.
 * Expects a line like "Match score: 70%".
 */
function parseMatchScore(rawResponse: string): number {
  const matchPattern = /match score:\s*(\d+)%/i;
  const match = rawResponse.match(matchPattern);
  return match && match[1] ? parseInt(match[1], 10) : 65;
}
=======
 * Parse the Gemini response into structured format
 * @param rawResponse The raw text response from Gemini
 * @returns Array of bullet points
 */
function parseGeminiResponse(rawResponse: string): string[] {
  // Split by line breaks and process
  const lines = rawResponse.split(/\r?\n/);
  const bulletPoints: string[] = [];
  
  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines and headers
    if (!line || line.match(/^#+\s/) || line.match(/^[0-9]+\.\s+[A-Z\s]+:$/)) {
      continue;
    }
    
    // Remove markdown bullet points if present
    if (line.startsWith('- ')) {
      line = line.substring(2);
    } else if (line.startsWith('* ')) {
      line = line.substring(2);
    }
    
    // Remove numbering if present (like "1. ")
    line = line.replace(/^\d+\.\s+/, '');
    
    // Only add non-empty lines with meaningful content
    if (line.length > 5) {
      bulletPoints.push(line);
    }
  }
  
  // If no bullet points were extracted, return the raw response split by line breaks
  if (bulletPoints.length === 0) {
    return rawResponse.split(/\r?\n/).filter(line => line.trim().length > 0);
  }
  
  return bulletPoints;
}
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
