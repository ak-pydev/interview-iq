// app/api/resume-enhance/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";

// MongoDB connection with fixed string format
// NOTE: The connection string should NOT use SRV format if DNS resolution is failing
const uri = process.env.MONGODB_URI || "";
// Create a direct connection instead of SRV lookup
const client = new MongoClient(uri, {
  connectTimeoutMS: 10000, // 10 seconds connection timeout
  socketTimeoutMS: 45000,  // 45 seconds socket timeout
});
const dbName = "propelcareerai-db";

// Define allowed file types
const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  let mongoConnection = false;
  
  try {
    console.log("Processing upload request...");
    
    // Get user information
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(`Processing upload for user: ${userId}`);

    // Parse form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload a PDF or Word document.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 5MB limit.` },
        { status: 400 }
      );
    }

    // Generate a uuid for the filename
    const fileUuid = uuidv4();
    console.log(`Generated file UUID: ${fileUuid}`);
    
    // Create directory structure if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", userId);
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log(`Created uploads directory: ${uploadsDir}`);
    } catch (dirError) {
      console.error("Error creating directory:", dirError);
      return NextResponse.json(
        { error: "Failed to create upload directory. Please try again." },
        { status: 500 }
      );
    }
    
    // Get the file extension
    const fileExtension = file.name.split('.').pop() || "";
    
    // Create file path
    const filePath = join(uploadsDir, `${fileUuid}.${fileExtension}`);
    console.log(`File will be saved to: ${filePath}`);
    
    // Convert the file to ArrayBuffer and then to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to disk
    try {
      await writeFile(filePath, fileBuffer);
      console.log(`File saved successfully to disk: ${filePath}`);
    } catch (fileError) {
      console.error("Error writing file to disk:", fileError);
      return NextResponse.json(
        { error: "Failed to save file to disk. Please try again." },
        { status: 500 }
      );
    }
    
    // Extract other form data
    const jobDescription = formData.get("jobDescription") as string;
    const companyName = formData.get("companyName") as string;
    
    // Check if this is for interview or general purpose
    const interviewType = formData.get("interviewType") as string;
    const targetRole = formData.get("targetRole") as string || formData.get("jobTitle") as string;
    
    // Use targetRole as fallback if jobTitle is provided instead
    const jobTitle = formData.get("jobTitle") as string || targetRole;
    
    console.log(`Form data: companyName=${companyName}, targetRole=${targetRole}, interviewType=${interviewType}`);
    
    // Instead of using MongoDB, create a mock response for testing
    // This will help determine if the MongoDB connection is the only issue
    if (process.env.MOCK_DB === 'true') {
      console.log("MOCK_DB is enabled, skipping database operations");
      const sessionId = uuidv4();
      const mockFileId = uuidv4();
      
      // Return mock response based on request type
      if (interviewType) {
        return NextResponse.json({
          success: true,
          fileId: mockFileId,
          sessionId: sessionId,
          message: "[MOCK] File uploaded successfully and interview session created"
        }, { status: 200 });
      } else {
        return NextResponse.json({
          fileId: mockFileId,
          message: "[MOCK] File uploaded successfully",
          status: "success"
        }, { status: 200 });
      }
    }
    
    // Try alternative connection method if normal one fails
    console.log("Connecting to MongoDB...");
    try {
      // Use a timeout for the connection attempt
      const connectPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), 10000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      mongoConnection = true;
      console.log("Connected to MongoDB");
      
      const db = client.db(dbName);
      const resumeFiles = db.collection("resume_files");
      
      // Create base document
      const fileDoc = {
        userId,
        originalName: file.name,
        fileName: `${fileUuid}.${fileExtension}`,
        fileType: file.type,
        fileSize: file.size,
        filePath,
        jobDescription,
        companyName,
        targetRole: targetRole || jobTitle,
        uploadDate: new Date()
      };
      
      // Insert resume file document
      const result = await resumeFiles.insertOne(fileDoc);
      console.log(`File document created with ID: ${result.insertedId}`);
      
      // If this is an interview request, create a session
      if (interviewType) {
        const sessionId = uuidv4();
        const interviewSessions = db.collection("interview_sessions");
        
        await interviewSessions.insertOne({
          sessionId,
          userId,
          fileId: result.insertedId.toString(),
          jobTitle: jobTitle || targetRole,
          companyName,
          jobDescription,
          interviewType,
          status: "created",
          createdAt: new Date()
        });
        
        console.log(`Interview session created with ID: ${sessionId}`);
        
        return NextResponse.json({
          success: true,
          fileId: result.insertedId.toString(),
          sessionId: sessionId,
          message: "File uploaded successfully and interview session created"
        }, { status: 200 });
      }
      
      // Return general purpose response
      return NextResponse.json({
        fileId: result.insertedId.toString(),
        message: "File uploaded successfully",
        status: "success"
      }, { status: 200 });
      
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      console.error(`DB Error details: ${dbError.name || ''} - ${dbError.code || ''}`);
      console.error(`Message: ${dbError.message || 'No message'}`);
      
      if (dbError.name === 'MongoServerSelectionError' || dbError.message.includes('querySrv')) {
        return NextResponse.json(
          { 
            error: "Failed to connect to MongoDB. The connection string may be incorrect or DNS resolution is failing. Please check your environment variables and network configuration.",
            details: dbError.message
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Database operation failed: ${dbError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { error: "Failed to upload file: " + errorMessage },
      { status: 500 }
    );
  } finally {
    // Ensure MongoDB connection is closed if it was opened
    if (mongoConnection) {
      try {
        await client.close();
        console.log("MongoDB connection closed");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}

// Configure body parser limits
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '8mb',
  },
};