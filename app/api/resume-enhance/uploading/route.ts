import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(request: Request) {
  try {
    // Parse the incoming form data (multipart/form-data)
    const formData = await request.formData();

    // Extract expected fields
    const file = formData.get('file');
    const jobDescription = formData.get('jobDescription');
    const companyName = formData.get('companyName');
    const targetRole = formData.get('targetRole');

    // Validate that all required fields are present.
    if (!file || !jobDescription || !companyName || !targetRole) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Process the file if provided.
    let fileData: Buffer | null = null;
    let fileName: string | null = null;
    if (file instanceof File) {
      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
    }

    // Prepare the document to be inserted.
    const document = {
      fileData, // Stored as a Buffer. For larger files consider using GridFS.
      fileName,
      jobDescription: jobDescription.toString(),
      companyName: companyName.toString(),
      targetRole: targetRole.toString(),
      createdAt: new Date(),
    };

    // Connect to the database and insert the document.
    const client = await clientPromise;
    const db = client.db('propelcareerdb');
    const collection = db.collection('resume-enhancedb');
    const result = await collection.insertOne(document);

    // Generate a file URL based on the inserted document's id.
    // Adjust the URL pattern to match your application's routing.
    const fileUrl = `/api/resume-enhance/files/${result.insertedId}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (error: any) {
    console.error('Error uploading resume enhancement response:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
