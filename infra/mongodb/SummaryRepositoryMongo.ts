// MongoSummaryRepository.ts
import { connectToDatabase } from "./mongodb";
import { ISummaryRepository } from "@/domain/summary/ISummaryRepository";
import { SummaryData } from "@/domain/summary/SummaryData";

export abstract class SummaryRepositoryMongo implements ISummaryRepository {
  constructor(private collectionName: string) {}
  async create(summary: SummaryData): Promise<void> {
    const { db, client } = await connectToDatabase();
    await db.collection<SummaryData>(this.collectionName).insertOne(summary);
    await client.close();
  }

  async findByVideoId(videoId: string): Promise<SummaryData | null> {
    const { db, client } = await connectToDatabase();
    const summary = await db
      .collection<SummaryData>(this.collectionName)
      .findOne({ video_id: videoId });
      await client.close();
    return summary;
  }

  async getAll(): Promise<SummaryData[] | null> {
    const { db } = await connectToDatabase();
    const summaries = await db
      .collection<SummaryData>(this.collectionName)
      .find({})
      .toArray();
    return summaries;
  }

  async update(summary: SummaryData): Promise<void> {
    const { db } = await connectToDatabase();
    await db
      .collection(this.collectionName)
      .updateOne({ video_id: summary.video_id }, { $set: summary });
  }

  async delete(videoId: string): Promise<void> {
    const { db } = await connectToDatabase();
    await db.collection(this.collectionName).deleteOne({ video_id: videoId });
  }
}

export class MongoSummaryChapterRepository extends SummaryRepositoryMongo {
	  constructor() {
	super("summary_chapters");
  }
}

export class MongoSummaryTranscriptRepository extends SummaryRepositoryMongo {
	constructor() {
  super("summary_transcripts");
}
}