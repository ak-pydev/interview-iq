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
    
    if (fileExtension === 'docx') {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (fileExtension === 'doc') {
      mimeType = "application/msword";
    }

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
    const promptText = `
I need a detailed analysis of this resume compared to the following job description for a ${targetRole} position at ${companyName}:

JOB DESCRIPTION:
${jobDescription}

Please provide a comprehensive analysis with the following sections:

1. MATCH PERCENTAGE:
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
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBase64,
          mimeType: mimeType,
        },
      },
      promptText,
    ]);

    if (!result.response || !result.response.text) {
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
  }
}

/**
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