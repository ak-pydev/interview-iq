// db.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to your environment variables.');
}

const uri = process.env.MONGODB_URI; // e.g., "mongodb+srv://<username>:<password>@cluster.mongodb.net/propelcareerdb.mockinterview-behavior?retryWrites=true&w=majority"
const options = {};

// Use a global variable in development to prevent multiple instances
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise as db };
