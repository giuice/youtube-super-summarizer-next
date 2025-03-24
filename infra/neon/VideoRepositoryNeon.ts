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
      const query = `
        INSERT INTO videos (
          video_id, 
          title, 
          author_name, 
          author_url, 
          thumbnail_url, 
          html
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      const values = [
        video.video_id,
        video.title,
        video.author_name,
        video.author_url,
        video.thumbnail_url,
        video.html
      ];

      const result = await this.neon.query(query, values);
      
      if (result.rowCount === 0) {
        throw new Error("Failed to create video");
      }
    } catch (error) {
      throw error;
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
