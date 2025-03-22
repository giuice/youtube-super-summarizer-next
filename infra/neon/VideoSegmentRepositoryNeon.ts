import neon from "./NeonPostgres";
import { VideoSegmentData } from "../../domain/video_segment/VideoSegmentData";
import { IVideoSegmentRepository } from "../../domain/video_segment/IVideoSegmentRepository";

export class VideoSegmentRepositoryNeon implements IVideoSegmentRepository {
  private readonly neon = neon;

  async create(videoSegment: VideoSegmentData): Promise<void> {
    try {
      const keys = Object.keys(videoSegment);
      const values = Object.values(videoSegment);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO video_segments (${keys.join(', ')})
        VALUES (${placeholders})
      `;
      
      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error("Failed to create video segment"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<VideoSegmentData[] | null> {
    try {
      const result = await this.neon.query(
        "SELECT * FROM video_segments WHERE video_id = $1 ORDER BY start_time ASC",
        [videoId]
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows as VideoSegmentData[];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createMany(segments: VideoSegmentData[]): Promise<void> {
    if (segments.length === 0) {
      return;
    }

    // Start a transaction to ensure all segments are inserted
    const { client, done } = await neon.getClient();
    
    try {
      await client.query('BEGIN');
      
      for (const segment of segments) {
        const keys = Object.keys(segment);
        const values = Object.values(segment);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        
        const query = `
          INSERT INTO video_segments (${keys.join(', ')})
          VALUES (${placeholders})
        `;
        
        await client.query(query, values);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      return Promise.reject(error);
    } finally {
      done();
    }
  }

  async deleteByVideoId(videoId: string): Promise<void> {
    try {
      const result = await this.neon.query(
        "DELETE FROM video_segments WHERE video_id = $1",
        [videoId]
      );
      
      // Note: Not checking rowCount here as there might be no segments to delete
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default VideoSegmentRepositoryNeon;