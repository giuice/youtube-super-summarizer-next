import neon from "./NeonPostgres";
import { TranscriptData } from "@/domain/transcript/Transcript";
import { ITranscriptRepository } from "@/domain/transcript/Transcript";

export class TranscriptRepositoryNeon implements ITranscriptRepository {
  private readonly neon = neon;

  constructor() {}
  
  async getAll(): Promise<TranscriptData[] | null> {
    try {
      const result = await this.neon.query(
        "SELECT * FROM transcripts"
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows as TranscriptData[];
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async update(transcript: TranscriptData): Promise<void> {
    try {
      // Get the keys and values from the transcript object
      const entries = Object.entries(transcript).filter(([key]) => key !== 'video_id'); // Exclude video_id from updates
      
      if (entries.length === 0) {
        return; // Nothing to update
      }
      
      const setClause = entries.map(([key], index) => `${key} = $${index + 2}`).join(', ');
      const values = [transcript.video_id, ...entries.map(([_, value]) => value)];
      
      const query = `
        UPDATE transcripts
        SET ${setClause}
        WHERE video_id = $1
      `;
      
      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error("Failed to update transcript"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async delete(videoId: string): Promise<void> {
    try {
      const result = await this.neon.query(
        "DELETE FROM transcripts WHERE video_id = $1",
        [videoId]
      );
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error("Failed to delete transcript"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(transcript: TranscriptData): Promise<void> {
    try {
      // Create a query with all the fields from TranscriptData
      const keys = Object.keys(transcript);
      const values = Object.values(transcript);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO transcripts (${keys.join(', ')})
        VALUES (${placeholders})
      `;
      
      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error("Failed to create transcript"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<TranscriptData | null> {
    try {
      const result = await this.neon.query(
        "SELECT * FROM transcripts WHERE video_id = $1",
        [videoId]
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0] as TranscriptData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TranscriptRepositoryNeon;