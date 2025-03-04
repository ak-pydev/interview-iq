import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getAuth } from '@clerk/nextjs/server';

// Augment the NodeJS global type to include our cached promise.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(request: NextRequest) {
  try {
    // Retrieve the authenticated user ID from Clerk.
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Parse the incoming form data (multipart/form-data)
    const formData = await request.formData();

    // Extract required fields.
    const file = formData.get('file');
    const jobDescription = formData.get('jobDescription');
    const companyName = formData.get('companyName');
    const targetRole = formData.get('targetRole');

    // Validate required fields.
    if (!file || !jobDescription || !companyName || !targetRole) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Process the file.
    let fileData: Buffer | null = null;
    let fileName: string | null = null;
    if (file instanceof File) {
      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
    }

    // Optional: Check if analysis is provided.
    // If your client already has parsed Gemini response, send it as a text field "analysis".
    let analysis: any = null;
    const analysisField = formData.get('analysis');
    if (analysisField && typeof analysisField === 'string') {
      try {
        analysis = JSON.parse(analysisField);
      } catch (e) {
        // If analysis field is a plain string, save it as-is.
        analysis = analysisField;
      }
    }

    // Prepare the document to be inserted.
    const document = {
      userId,
      fileData, // Stored as a Buffer. For larger files consider using GridFS.
      fileName,
      jobDescription: jobDescription.toString(),
      companyName: companyName.toString(),
      targetRole: targetRole.toString(),
      // Save analysis if provided.
      analysis: analysis,
      createdAt: new Date(),
    };

    // Connect to the database and insert the document.
    const client = await clientPromise;
    const db = client.db('propelcareerai-db');
    // Save to the collection that stores both file response and (optionally) analysis.
    const collection = db.collection('resume-enhancer-response');
    const result = await collection.insertOne(document);

    // Generate a file URL based on the inserted document's id.
    const fileUrl = `/api/resume-enhance/files/${result.insertedId}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (error: any) {
    console.error('Error uploading resume enhancement response:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
