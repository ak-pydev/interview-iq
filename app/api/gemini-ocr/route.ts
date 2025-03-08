import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { currentUser } from "@clerk/nextjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { existsSync } from "fs";
import path from "path";
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
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const resumeFiles = db.collection("resume_files");

    // Find the file in the database
    const resumeFile = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId: userId,
    });

    await client.close();

    if (!resumeFile) {
      return NextResponse.json(
        { error: "File not found or you don't have permission to access it." },
        { status: 404 }
      );
    }

    // Check if the file exists on disk
    const filePath = resumeFile.filePath;
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found on server." },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Extract text from the file
    let extractedText;
    
    if (fileExtension === '.pdf') {
      // Process PDF using Gemini Vision Pro
      extractedText = await extractTextFromPDF(fileBuffer);
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      // Process Word document using appropriate method
      extractedText = await extractTextFromDoc(fileBuffer, fileExtension);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      fileId,
      text: extractedText,
      status: "success"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Failed to process document: " + error.message },
      { status: 500 }
    );
  }
}

// Function to extract text from a PDF using Gemini Vision Pro
async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    // Convert file buffer to base64
    const base64Data = fileBuffer.toString('base64');
    
    // Initialize the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Create a prompt for the model
    const prompt = "This is a resume document. Extract all the text content from this image, preserving the structure and formatting as much as possible. Include all sections such as contact information, education, work experience, skills, etc.";
    
    // Generate content from the model
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf"
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error in Gemini PDF extraction:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Function to extract text from a Word document
async function extractTextFromDoc(fileBuffer: Buffer, fileExtension: string): Promise<string> {
  try {
    // Convert file buffer to base64
    const base64Data = fileBuffer.toString('base64');
    
    // Initialize the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Create a prompt for the model
    const prompt = "This is a resume document. Extract all the text content from this document, preserving the structure and formatting as much as possible. Include all sections such as contact information, education, work experience, skills, etc.";
    
    // Generate content from the model
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: fileExtension === '.docx' 
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/msword"
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error in Gemini Word extraction:", error);
    throw new Error("Failed to extract text from Word document");
  }
}