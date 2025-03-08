import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = "resume-enhancer";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // Get user information
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = await request.json();
    const { resumeText, jobDescription, companyName, targetRole, fileId } = body;

    // Validate required fields
    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required." },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    if (!targetRole) {
      return NextResponse.json(
        { error: "Target role is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const resumeFiles = db.collection("resume_files");

    // Verify that the file belongs to the user
    const file = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId: userId
    });

    if (!file) {
      await client.close();
      return NextResponse.json(
        { error: "File not found or you don't have permission to access it." },
        { status: 404 }
      );
    }

    // Analyze the resume using Gemini AI
    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription, companyName, targetRole);

    // Store the analysis result in the database
    const resumeAnalyses = db.collection("resume_analyses");
    const matchScore = extractMatchScore(analysis);
    
    await resumeAnalyses.insertOne({
      userId,
      fileId: new ObjectId(fileId),
      analysis,
      matchScore,
      createdAt: new Date()
    });

    await client.close();

    return NextResponse.json({
      analysis,
      matchScore,
      status: "success"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume: " + error.message },
      { status: 500 }
    );
  }
}

// Function to analyze the resume using Gemini AI
async function analyzeResumeWithGemini(
  resumeText: string, 
  jobDescription: string, 
  companyName: string, 
  targetRole: string
): Promise<string> {
  try {
    // Initialize the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a prompt for the model
    const prompt = `
    You are an expert resume analyzer and career coach. I need you to analyze a resume against a specific job description.
    
    RESUME TEXT:
    ${resumeText}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    COMPANY: ${companyName}
    TARGET ROLE: ${targetRole}
    
    Please provide a comprehensive analysis with the following:
    
    1. Calculate a match score as a percentage (e.g., 75%) based on how well the resume matches the job requirements.
    2. Identify keywords from the job description that are present in the resume.
    3. Identify important keywords from the job description that are missing from the resume.
    4. List the resume's strengths in relation to this specific job.
    5. List areas where the resume could be improved to better match this job.
    6. Provide specific, actionable recommendations to improve the resume for this position.
    
    Format your response as a structured analysis with clear sections and bullet points. Begin with the match score.
    `;
    
    // Generate content from the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    return analysis;
  } catch (error) {
    console.error("Error in Gemini analysis:", error);
    throw new Error("Failed to analyze resume with AI");
  }
}

// Helper function to extract match score from the analysis text
function extractMatchScore(analysisText: string): number | null {
  // Try to find percentage patterns like "75%" or "match score: 68%"
  const percentageMatch = analysisText.match(/match score:?\s*(\d+)%/i) || 
                          analysisText.match(/(\d+)%\s*match/i) ||
                          analysisText.match(/^(\d+)%/i);
  
  if (percentageMatch && percentageMatch[1]) {
    const score = parseInt(percentageMatch[1], 10);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      return score;
    }
  }
  
  return null;
}