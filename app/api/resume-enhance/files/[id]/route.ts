import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { currentUser } from "@clerk/nextjs/server";
import { MongoClient, ObjectId } from "mongodb";
import { existsSync } from "fs";
import path from "path";

// MongoDB connection
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = "propelcareerai-db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const fileId = params.id;
    
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

    // Fetch file metadata from the database
    const fileMetadata = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId
    });

    await client.close();

    if (!fileMetadata) {
      return NextResponse.json(
        { error: "File not found or you don't have permission to access it." },
        { status: 404 }
      );
    }

    // Find the file path
    const filePath = fileMetadata.filePath as string;
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found on server." },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Get the file extension and set appropriate content type
    const fileExtension = path.extname(filePath).toLowerCase();
    let contentType: string;
    
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileMetadata.originalName}"`,
      },
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file: " + errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const fileId = params.id;
    
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
    const resumeAnalyses = db.collection("resume_analyses");

    // Ensure the file belongs to the user
    const file = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId
    });

    if (!file) {
      await client.close();
      return NextResponse.json(
        { error: "File not found or you don't have permission to delete it." },
        { status: 404 }
      );
    }

    // Delete associated analyses
    await resumeAnalyses.deleteMany({
      fileId: new ObjectId(fileId)
    });

    // Delete the file record from the database
    await resumeFiles.deleteOne({
      _id: new ObjectId(fileId)
    });

    await client.close();

    return NextResponse.json({
      message: "File deleted successfully",
      status: "success"
    }, { status: 200 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file: " + errorMessage },
      { status: 500 }
    );
  }
}