import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { existsSync } from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = "propelcareerai-db"; // Using the correct database name

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    console.log("OCR route started");
    
    // Get user information
    const user = await currentUser();
    if (!user) {
      console.log("Authentication failed: No user ID");
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = await request.json();
    const { fileId } = body;

    console.log("Processing file ID:", fileId);

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

    console.log("Connected to MongoDB, looking for file");

    // Find the file in the database
    const resumeFile = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId
    });

    await client.close();

    if (!resumeFile) {
      console.log("File not found in database");
      return NextResponse.json(
        { error: "File not found or you don't have permission to access it." },
        { status: 404 }
      );
    }

    console.log("File found in database:", resumeFile._id.toString());

    // Check if the file exists on disk
    const filePath = resumeFile.filePath;
    if (!existsSync(filePath)) {
      console.log("File not found on disk at path:", filePath);
      return NextResponse.json(
        { error: "File not found on server." },
        { status: 404 }
      );
    }

    console.log("File exists on disk, reading file");

    // Read the file
    const fileBuffer = await readFile(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    console.log("File read successfully, file extension:", fileExtension);
    console.log("File size:", fileBuffer.length, "bytes");
    
    // Extract text from the file
    let extractedText = "";
    
    if (fileExtension === '.pdf') {
      console.log("Processing PDF file");
      // Process PDF using Gemini Vision Pro
      extractedText = await extractTextFromPDF(fileBuffer);
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      console.log("Processing Word document");
      // Process Word document using appropriate method
      extractedText = await extractTextFromDoc(fileBuffer, fileExtension);
    } else {
      console.log("Unsupported file format:", fileExtension);
      return NextResponse.json(
        { error: "Unsupported file format." },
        { status: 400 }
      );
    }

    console.log("Text extraction completed successfully");
    console.log("Extracted text length:", extractedText.length);

    return NextResponse.json({
      fileId,
      text: extractedText,
      status: "success"
    }, { status: 200 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "No stack trace available";
    
    console.error("Detailed OCR error:", error);
    console.error("Error message:", errorMessage);
    console.error("Error stack:", errorStack);
    
    return NextResponse.json(
      { error: "Failed to process document: " + errorMessage },
      { status: 500 }
    );
  }
}

// Function to extract text from a PDF using Gemini Vision Pro
async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    console.log("Starting PDF extraction with Gemini");
    
    // Convert file buffer to base64
    const base64Data = fileBuffer.toString('base64');
    console.log("Converted PDF to base64, length:", base64Data.length);
    
    // Initialize the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a prompt for the model
    const prompt = "This is a resume document. Extract all the text content from this image, preserving the structure and formatting as much as possible. Include all sections such as contact information, education, work experience, skills, etc.";
    
    console.log("Sending PDF to Gemini AI for processing");
    
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
    
    console.log("PDF extraction successful");
    return text;
  } catch (error) {
    console.error("Detailed error in Gemini PDF extraction:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    throw new Error("Failed to extract text from PDF: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Function to extract text from a Word document
async function extractTextFromDoc(fileBuffer: Buffer, fileExtension: string): Promise<string> {
  try {
    console.log("Starting Word document extraction with Gemini");
    
    // Convert file buffer to base64
    const base64Data = fileBuffer.toString('base64');
    console.log("Converted Word document to base64, length:", base64Data.length);
    
    // Initialize the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Create a prompt for the model
    const prompt = "This is a resume document. Extract all the text content from this document, preserving the structure and formatting as much as possible. Include all sections such as contact information, education, work experience, skills, etc.";
    
    console.log("Sending Word document to Gemini AI for processing");
    
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
    
    console.log("Word document extraction successful");
    return text;
  } catch (error) {
    console.error("Detailed error in Gemini Word extraction:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    throw new Error("Failed to extract text from Word document: " + (error instanceof Error ? error.message : String(error)));
  }
}