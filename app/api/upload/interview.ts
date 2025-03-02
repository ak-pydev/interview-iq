import express from '@clerk/express';
import { requireSession } from '@clerk/express';
import { MongoClient, UpdateResult } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}
const uri: string = process.env.MONGODB_URI;
const client = new MongoClient(uri);

interface InterviewRequestBody {
  interviewResponses: any;
}

const router = express.Router();

router.post('/interview', requireSession(), async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = session.userId;
    await client.connect();
    const db = client.db('yourDatabaseName');
    const collection = db.collection('yourCollectionName');
    const { interviewResponses } = req.body as InterviewRequestBody;
    const result: UpdateResult = await collection.updateOne(
      { clerkUserId: userId },
      { $set: { interviewResponses, updatedAt: new Date() } },
      { upsert: true }
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error updating interview responses:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  } finally {
    await client.close();
  }
});

export default router;
