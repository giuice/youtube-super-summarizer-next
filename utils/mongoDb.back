import { MongoClient, Db, Collection, UpdateResult } from "mongodb";
import CONFIG from "./config";
const uri = CONFIG.MONGO_CONNECTION_STRING;

const options = {};

const client = new MongoClient(uri, options);

export async function connectToDatabase(): Promise<Db> {
  await client.connect();
  return client.db("db_ytsummarizer");
}

export async function saveTranscript(
  videoId: string,
  transcript: string
): Promise<UpdateResult> {
  const db: Db = await connectToDatabase();
  const collection: Collection = db.collection("transcripts");
  const result: UpdateResult = await collection.updateOne(
    { videoId },
    { $set: { transcript } },
    { upsert: true }
  );
  return result;
}

export async function saveSummary(
  videoId: string,
  summary: string
): Promise<UpdateResult> {
  const db: Db = await connectToDatabase();
  const collection: Collection = db.collection("summaries");
  const result: UpdateResult = await collection.updateOne(
    { videoId },
    { $set: { summary } },
    { upsert: true }
  );
  return result;
}

export async function getTranscript(
  videoId: string
): Promise<string | undefined> {
  const db: Db = await connectToDatabase();
  const collection: Collection = db.collection("transcripts");
  const result = await collection.findOne({ videoId });
  return result?.transcript;
}

export async function getSummary(videoId: string): Promise<string | undefined> {
  const db: Db = await connectToDatabase();
  const collection: Collection = db.collection("summaries");
  const result = await collection.findOne({ videoId });
  return result?.summary;
}
