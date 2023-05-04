import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI as string;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  await client.connect();
  const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB_NAME);
  return { db, client };
}