// File: app/api/uploading/interviews/route.ts

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'propelcareerdb';
const COLLECTION_NAME = 'mockinterview-behavior';

export async function POST(request: Request) {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  let client: MongoClient | null = null;

  try {
    const data = await request.json();
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Insert the data
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne({
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error: any) {
    console.error("Error saving to database:", error);
    
    // Return error response with more details
    return NextResponse.json(
      { 
        error: "Failed to save data",
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}