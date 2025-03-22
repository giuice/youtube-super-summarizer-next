import neon from "./NeonPostgres";
import { VideoData } from "../../domain/video/VideoData";
import { IVideoRepository } from "../../domain/video/IVideoRepository";

export class VideoRepositoryNeon implements IVideoRepository {
  private readonly neon = neon;

  async getAll(): Promise<VideoData[] | null> {
    try {
      const result = await this.neon.query(
        "SELECT * FROM videos ORDER BY created_at DESC LIMIT 100"
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows as VideoData[];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(video: VideoData): Promise<void> {
    try {
      // Create a query with all the fields from VideoData
      const keys = Object.keys(video);
      const values = Object.values(video);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO videos (${keys.join(', ')})
        VALUES (${placeholders})
      `;

      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        return Promise.reject(new Error("Failed to create video"));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<VideoData | null> {
    try {
      const result = await this.neon.query(
        "SELECT * FROM videos WHERE video_id = $1",
        [videoId]
      );
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0] as VideoData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default VideoRepositoryNeon;