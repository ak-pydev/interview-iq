import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise: Promise<MongoClient>;
if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await the params before destructuring.
    const { id } = await Promise.resolve(params);
    const client = await clientPromise;
    const db = client.db('propelcareerdb');
    const collection = db.collection('resume-enhancedb');
    const document = await collection.findOne({ _id: new ObjectId(id) });
    if (!document || !document.fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const fileBuffer = document.fileData.buffer ? document.fileData.buffer : document.fileData;
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="${document.fileName || 'file.pdf'}"`);
    return new NextResponse(fileBuffer, { headers });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
