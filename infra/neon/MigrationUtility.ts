import supabase from "../supabase/supabase";
import neon from "./NeonPostgres";
import { VideoData } from "../../domain/video/VideoData";
import { TranscriptData } from "../../domain/transcript/Transcript";
import { SummaryData } from "../../domain/summary/SummaryData";
import { VideoSegmentData } from "../../domain/video_segment/VideoSegmentData";

/**
 * Utility class to handle the migration of data from Supabase to Neon PostgreSQL
 */
export class MigrationUtility {
  /**
   * Migrate all data from Supabase to Neon PostgreSQL
   * @param options Configuration options for the migration
   * @returns A summary of the migration results
   */
  static async migrateAll(options: {
    batchSize?: number;
    logProgress?: boolean;
    validateData?: boolean;
  } = {}): Promise<MigrationSummary> {
    const { batchSize = 50, logProgress = true, validateData = true } = options;
    
    const summary: MigrationSummary = {
      videos: { total: 0, migrated: 0, failed: 0, errors: [] },
      transcripts: { total: 0, migrated: 0, failed: 0, errors: [] },
      summaryChapters: { total: 0, migrated: 0, failed: 0, errors: [] },
      summaryTranscripts: { total: 0, migrated: 0, failed: 0, errors: [] },
      videoSegments: { total: 0, migrated: 0, failed: 0, errors: [] },
    };

    try {
      // Migrate videos
      if (logProgress) console.log("Starting video migration...");
      const videoResult = await this.migrateVideos(batchSize, validateData, logProgress);
      summary.videos = videoResult;
      
      // Migrate transcripts
      if (logProgress) console.log("Starting transcript migration...");
      const transcriptResult = await this.migrateTranscripts(batchSize, validateData, logProgress);
      summary.transcripts = transcriptResult;
      
      // Migrate summary chapters
      if (logProgress) console.log("Starting summary chapters migration...");
      const summaryChaptersResult = await this.migrateSummaryChapters(batchSize, validateData, logProgress);
      summary.summaryChapters = summaryChaptersResult;
      
      // Migrate summary transcripts
      if (logProgress) console.log("Starting summary transcripts migration...");
      const summaryTranscriptsResult = await this.migrateSummaryTranscripts(batchSize, validateData, logProgress);
      summary.summaryTranscripts = summaryTranscriptsResult;
      
      // Migrate video segments
      if (logProgress) console.log("Starting video segments migration...");
      const videoSegmentsResult = await this.migrateVideoSegments(batchSize, validateData, logProgress);
      summary.videoSegments = videoSegmentsResult;
      
      if (logProgress) {
        console.log("Migration completed with the following results:");
        console.log(JSON.stringify(summary, null, 2));
      }
      
      return summary;
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  }

  /**
   * Migrate videos from Supabase to Neon PostgreSQL
   */
  private static async migrateVideos(
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    const result: MigrationResult = { total: 0, migrated: 0, failed: 0, errors: [] };
    
    try {
      // Fetch all videos from Supabase
      const { data: videos, error } = await supabase.from("videos").select("*");
      
      if (error) {
        throw new Error(`Failed to fetch videos: ${error.message}`);
      }
      
      result.total = videos.length;
      
      // Process videos in batches
      for (let i = 0; i < videos.length; i += batchSize) {
        const batch = videos.slice(i, i + batchSize);
        
        if (logProgress) {
          console.log(`Processing video batch ${i / batchSize + 1}/${Math.ceil(videos.length / batchSize)}`);
        }
        
        // Process each video in the batch
        for (const video of batch) {
          try {
            // Insert video into Neon PostgreSQL
            const keys = Object.keys(video);
            const values = Object.values(video);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            
            const query = `
              INSERT INTO videos (${keys.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT (video_id) DO NOTHING
            `;
            
            await neon.query(query, values);
            
            // Validate if requested
            if (validateData) {
              const validationResult = await neon.query(
                "SELECT * FROM videos WHERE video_id = $1",
                [video.video_id]
              );
              
              if (!validationResult.rows || validationResult.rows.length === 0) {
                throw new Error(`Validation failed: Video ${video.video_id} not found after migration`);
              }
            }
            
            result.migrated++;
          } catch (error) {
            result.failed++;
            result.errors.push({
              id: video.video_id,
              error: error instanceof Error ? error.message : String(error)
            });
            
            if (logProgress) {
              console.error(`Failed to migrate video ${video.video_id}:`, error);
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error("Video migration failed:", error);
      throw error;
    }
  }

  /**
   * Migrate transcripts from Supabase to Neon PostgreSQL
   */
  private static async migrateTranscripts(
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    const result: MigrationResult = { total: 0, migrated: 0, failed: 0, errors: [] };
    
    try {
      // Fetch all transcripts from Supabase
      const { data: transcripts, error } = await supabase.from("transcripts").select("*");
      
      if (error) {
        throw new Error(`Failed to fetch transcripts: ${error.message}`);
      }
      
      result.total = transcripts.length;
      
      // Process transcripts in batches
      for (let i = 0; i < transcripts.length; i += batchSize) {
        const batch = transcripts.slice(i, i + batchSize);
        
        if (logProgress) {
          console.log(`Processing transcript batch ${i / batchSize + 1}/${Math.ceil(transcripts.length / batchSize)}`);
        }
        
        // Process each transcript in the batch
        for (const transcript of batch) {
          try {
            // Insert transcript into Neon PostgreSQL
            const keys = Object.keys(transcript);
            const values = Object.values(transcript);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            
            const query = `
              INSERT INTO transcripts (${keys.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT (video_id) DO NOTHING
            `;
            
            await neon.query(query, values);
            
            // Validate if requested
            if (validateData) {
              const validationResult = await neon.query(
                "SELECT * FROM transcripts WHERE video_id = $1",
                [transcript.video_id]
              );
              
              if (!validationResult.rows || validationResult.rows.length === 0) {
                throw new Error(`Validation failed: Transcript for video ${transcript.video_id} not found after migration`);
              }
            }
            
            result.migrated++;
          } catch (error) {
            result.failed++;
            result.errors.push({
              id: transcript.video_id,
              error: error instanceof Error ? error.message : String(error)
            });
            
            if (logProgress) {
              console.error(`Failed to migrate transcript for video ${transcript.video_id}:`, error);
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error("Transcript migration failed:", error);
      throw error;
    }
  }

  /**
   * Migrate summary chapters from Supabase to Neon PostgreSQL
   */
  private static async migrateSummaryChapters(
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    return this.migrateSummaries("summary_chapters", batchSize, validateData, logProgress);
  }

  /**
   * Migrate summary transcripts from Supabase to Neon PostgreSQL
   */
  private static async migrateSummaryTranscripts(
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    return this.migrateSummaries("summary_transcripts", batchSize, validateData, logProgress);
  }

  /**
   * Generic method to migrate summaries from Supabase to Neon PostgreSQL
   */
  private static async migrateSummaries(
    tableName: string,
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    const result: MigrationResult = { total: 0, migrated: 0, failed: 0, errors: [] };
    
    try {
      // Fetch all summaries from Supabase
      const { data: summaries, error } = await supabase.from(tableName).select("*");
      
      if (error) {
        throw new Error(`Failed to fetch summaries from ${tableName}: ${error.message}`);
      }
      
      result.total = summaries.length;
      
      // Process summaries in batches
      for (let i = 0; i < summaries.length; i += batchSize) {
        const batch = summaries.slice(i, i + batchSize);
        
        if (logProgress) {
          console.log(`Processing ${tableName} batch ${i / batchSize + 1}/${Math.ceil(summaries.length / batchSize)}`);
        }
        
        // Process each summary in the batch
        for (const summary of batch) {
          try {
            // Insert summary into Neon PostgreSQL
            const keys = Object.keys(summary);
            const values = Object.values(summary);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            
            const query = `
              INSERT INTO ${tableName} (${keys.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT (video_id) DO NOTHING
            `;
            
            await neon.query(query, values);
            
            // Validate if requested
            if (validateData) {
              const validationResult = await neon.query(
                `SELECT * FROM ${tableName} WHERE video_id = $1`,
                [summary.video_id]
              );
              
              if (!validationResult.rows || validationResult.rows.length === 0) {
                throw new Error(`Validation failed: Summary for video ${summary.video_id} not found in ${tableName} after migration`);
              }
            }
            
            result.migrated++;
          } catch (error) {
            result.failed++;
            result.errors.push({
              id: summary.video_id,
              error: error instanceof Error ? error.message : String(error)
            });
            
            if (logProgress) {
              console.error(`Failed to migrate summary for video ${summary.video_id} in ${tableName}:`, error);
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error(`${tableName} migration failed:`, error);
      throw error;
    }
  }

  /**
   * Migrate video segments from Supabase to Neon PostgreSQL
   */
  private static async migrateVideoSegments(
    batchSize: number,
    validateData: boolean,
    logProgress: boolean
  ): Promise<MigrationResult> {
    const result: MigrationResult = { total: 0, migrated: 0, failed: 0, errors: [] };
    
    try {
      // Fetch all video segments from Supabase
      const { data: segments, error } = await supabase.from("video_segments").select("*");
      
      if (error) {
        throw new Error(`Failed to fetch video segments: ${error.message}`);
      }
      
      result.total = segments.length;
      
      // Group segments by video_id
      const segmentsByVideo: Record<string, VideoSegmentData[]> = {};
      for (const segment of segments) {
        if (!segmentsByVideo[segment.video_id]) {
          segmentsByVideo[segment.video_id] = [];
        }
        segmentsByVideo[segment.video_id].push(segment);
      }
      
      // Process each video's segments
      const videoIds = Object.keys(segmentsByVideo);
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batchIds = videoIds.slice(i, i + batchSize);
        
        if (logProgress) {
          console.log(`Processing video segments batch ${i / batchSize + 1}/${Math.ceil(videoIds.length / batchSize)}`);
        }
        
        // Process each video's segments
        for (const videoId of batchIds) {
          const videoSegments = segmentsByVideo[videoId];
          
          try {
            // First, delete any existing segments for this video
            await neon.query("DELETE FROM video_segments WHERE video_id = $1", [videoId]);
            
            // Then insert all segments for this video
            const { client, done } = await neon.getClient();
            
            try {
              await client.query('BEGIN');
              
              for (const segment of videoSegments) {
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
              
              // Validate if requested
              if (validateData) {
                const validationResult = await neon.query(
                  "SELECT COUNT(*) FROM video_segments WHERE video_id = $1",
                  [videoId]
                );
                
                const count = parseInt(validationResult.rows[0].count);
                if (count !== videoSegments.length) {
                  throw new Error(`Validation failed: Expected ${videoSegments.length} segments for video ${videoId}, but found ${count}`);
                }
              }
              
              result.migrated += videoSegments.length;
            } catch (error) {
              await client.query('ROLLBACK');
              throw error;
            } finally {
              done();
            }
          } catch (error) {
            result.failed += videoSegments.length;
            result.errors.push({
              id: videoId,
              error: error instanceof Error ? error.message : String(error)
            });
            
            if (logProgress) {
              console.error(`Failed to migrate segments for video ${videoId}:`, error);
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error("Video segments migration failed:", error);
      throw error;
    }
  }
}

interface MigrationResult {
  total: number;
  migrated: number;
  failed: number;
  errors: { id: string; error: string }[];
}

interface MigrationSummary {
  videos: MigrationResult;
  transcripts: MigrationResult;
  summaryChapters: MigrationResult;
  summaryTranscripts: MigrationResult;
  videoSegments: MigrationResult;
}

export default MigrationUtility;