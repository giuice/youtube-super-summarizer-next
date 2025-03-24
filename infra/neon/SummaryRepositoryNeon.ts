import neon from "./NeonPostgres";
import { SummaryData } from "@/domain/summary/SummaryData";
import { ISummaryRepository } from "@/domain/summary/ISummaryRepository";
import  parseJsonFields  from "@/domain/utils/ParseJsonFields";
export class SummaryRepositoryNeon implements ISummaryRepository {
  constructor(private summaryTable: string) {}
  
  private readonly neon = neon;

  async getAll(): Promise<SummaryData[] | null> {
    try {
      const result = await this.neon.query(
        `SELECT * FROM ${this.summaryTable}`
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows as SummaryData[];
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async update(summary: SummaryData): Promise<void> {
    try {
      // Get the keys and values from the summary object
      const entries = Object.entries(summary).filter(([key]) => key !== 'video_id'); // Exclude video_id from updates
      
      if (entries.length === 0) {
        return; // Nothing to update
      }
      
      const setClause = entries.map(([key], index) => `${key} = $${index + 2}`).join(', ');
      const values = [summary.video_id, ...entries.map(([_, value]) => value)];
      
      const query = `
        UPDATE ${this.summaryTable}
        SET ${setClause}
        WHERE video_id = $1
      `;
      
      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error(`Failed to update summary in ${this.summaryTable}`));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async delete(videoId: string): Promise<void> {
    try {
      const result = await this.neon.query(
        `DELETE FROM ${this.summaryTable} WHERE video_id = $1`,
        [videoId]
      );
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error(`Failed to delete summary from ${this.summaryTable}`));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(summary: SummaryData): Promise<void> {
    try {
      // Create a query with all the fields from SummaryData
      const processedData = {
        video_id: summary.video_id,
        model: summary.model,
        summary: JSON.stringify(summary.summary),
        created_at: summary.created_at || new Date(),
      };
      const keys = Object.keys(processedData);
      const values = Object.values(processedData);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO ${this.summaryTable} (${keys.join(', ')})
        VALUES (${placeholders})
      `;
      
      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error(`Failed to create summary in ${this.summaryTable}`));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<SummaryData | null> {
    try {
      const result = await this.neon.query(
        `SELECT * FROM ${this.summaryTable} WHERE video_id = $1`,
        [videoId]
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return parseJsonFields(result.rows[0], ['summary']) as SummaryData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default SummaryRepositoryNeon;

export class SummaryChapterRepositoryNeon extends SummaryRepositoryNeon {
  constructor() {
    super("summary_chapters");
  }
}

export class SummaryTranscriptRepositoryNeon extends SummaryRepositoryNeon {
  constructor() {
    super("summary_transcripts");
  }
}