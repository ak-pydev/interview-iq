import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = "propelcareerai-db";

/**
 * This route is used to check the status of an ongoing file upload
 * and can be used by the frontend to display progress for long-running operations
 */
export async function GET(request: NextRequest) {
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

    // Get fileId from query parameters
    const fileId = request.nextUrl.searchParams.get('fileId');
    
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

    // Check if file exists in database
    const file = await resumeFiles.findOne({
      _id: new ObjectId(fileId),
      userId
    });

    if (!file) {
      await client.close();
      return NextResponse.json(
        { error: "File not found or still uploading." },
        { status: 404 }
      );
    }

    // Check if analysis exists for this file
    const analysis = await resumeAnalyses.findOne({
      fileId: new ObjectId(fileId)
    });

    await client.close();

    let status = "uploaded"; // Default status if file exists but no analysis yet
    
    if (analysis) {
      status = "analyzed";
    }

    return NextResponse.json({
      fileId,
      status,
      file: {
        name: file.originalName,
        uploadDate: file.uploadDate
      }
    }, { status: 200 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error checking upload status:", error);
    return NextResponse.json(
      { error: "Failed to check upload status: " + errorMessage },
      { status: 500 }
    );
  }
}