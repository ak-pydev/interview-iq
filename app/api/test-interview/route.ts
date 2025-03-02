// File: app/api/mockinterview-behavior/route.ts

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection details
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'propelcareerdb';
const COLLECTION_NAME = 'mockinterview-behavior';

export async function POST(request: Request) {
  // Check for MongoDB URI
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  let client: MongoClient | null = null;

  try {
    // Parse the request body
    const interviewData = await request.json();
    
    // Add timestamp if not present
    if (!interviewData.timestamp) {
      interviewData.timestamp = new Date().toISOString();
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Insert the data
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne(interviewData);

    // Return success response
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString(),
      message: "Interview data saved successfully" 
    });

  } catch (error: any) {
    console.error("Error saving interview data:", error);
    
    // Return error response
    return NextResponse.json(
      { error: `Failed to save interview data: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}