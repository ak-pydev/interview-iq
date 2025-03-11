import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";

// MongoDB connection
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
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
        { error: "Invalid file type. Please upload a PDF or Word document." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // Generate a uuid for the filename
    const fileUuid = uuidv4();
    
    // Create directory structure if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", userId);
    await mkdir(uploadsDir, { recursive: true });
    
    // Get the file extension
    const fileExtension = file.name.split('.').pop() || "";
    
    // Create file path
    const filePath = join(uploadsDir, `${fileUuid}.${fileExtension}`);
    
    // Convert the file to ArrayBuffer and then to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to disk
    await writeFile(filePath, fileBuffer);
    
    // Extract other form data
    const jobDescription = formData.get("jobDescription") as string;
    const companyName = formData.get("companyName") as string;
    const targetRole = formData.get("targetRole") as string;
    
    // Connect to MongoDB and save the file metadata
    await client.connect();
    const db = client.db(dbName);
    const resumeFiles = db.collection("resume_files");
    
    const result = await resumeFiles.insertOne({
      userId,
      originalName: file.name,
      fileName: `${fileUuid}.${fileExtension}`,
      fileType: file.type,
      filePath,
      jobDescription,
      companyName,
      targetRole,
      uploadDate: new Date()
    });
    
    await client.close();
    
    return NextResponse.json({
      fileId: result.insertedId.toString(),
      message: "File uploaded successfully",
      status: "success"
    }, { status: 200 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file: " + errorMessage },
      { status: 500 }
    );
  }
}