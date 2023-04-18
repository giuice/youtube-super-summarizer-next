// src/repositories/mongodb/MongoTranscriptRepository.ts

import { MongoClient } from 'mongodb';
import { TranscriptRepository, TranscriptData } from '../TranscriptRepository';

export class MongoTranscriptRepository implements TranscriptRepository {
  private readonly collectionName = 'transcripts';

  constructor(private readonly client: MongoClient, private readonly dbName: string) {}

  async save(transcriptData: TranscriptData): Promise<void> {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);

    await collection.updateOne(
      { video_id: transcriptData.video_id },
      { $set: transcriptData },
      { upsert: true }
    );
  }

  async findByVideoId(video_id: string): Promise<TranscriptData | null> {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);

    const transcriptData = (await collection.findOne({ video_id })) as TranscriptData | null;

    return transcriptData;
  }
}
