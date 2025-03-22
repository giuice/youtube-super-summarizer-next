import { IVideoRepository } from "../domain/video/IVideoRepository";
import { ITranscriptRepository } from "../domain/transcript/Transcript";
import { ISummaryRepository } from "../domain/summary/ISummaryRepository";
import { IVideoSegmentRepository } from "../domain/video_segment/IVideoSegmentRepository";

// Supabase implementations
import VideoRepositorySupabase from "../infra/supabase/VideoRepositorySupabase";
import TranscriptRepositorySupabase from "../infra/supabase/TranscriptRepositorySupabase";
import { SummaryChapterRepositorySupabase, SummaryTranscriptRepositorySupabase } from "../infra/supabase/SummaryRepositorySupabase";
import VideoSegmentRepositorySupabase from "../infra/supabase/VideoSegmentRepositorySupabase";

// Neon implementations
import VideoRepositoryNeon from "../infra/neon/VideoRepositoryNeon";
import TranscriptRepositoryNeon from "../infra/neon/TranscriptRepositoryNeon";
import { SummaryChapterRepositoryNeon, SummaryTranscriptRepositoryNeon } from "../infra/neon/SummaryRepositoryNeon";
import VideoSegmentRepositoryNeon from "../infra/neon/VideoSegmentRepositoryNeon";

// Database types supported
export type DatabaseType = 'supabase' | 'neon';

/**
 * Factory class to create repository instances based on the database configuration
 */
export class RepositoryFactory {
  // Get the active database from environment variable or default to Supabase during transition
  
  private static activeDatabase: DatabaseType = 
    (process.env.ACTIVE_DATABASE as DatabaseType) || 'neon';

  /**
   * Set the active database to use for all repositories
   * @param dbType The database type to use
   */
  static setActiveDatabase(dbType: DatabaseType): void {
    this.activeDatabase = dbType;
    console.log(`Active database set to: ${dbType}`);
  }

  /**
   * Get the currently active database
   */
  static getActiveDatabase(): DatabaseType {
    return this.activeDatabase;
  }

  /**
   * Create a video repository instance
   */
  static createVideoRepository(): IVideoRepository {
    switch (this.activeDatabase) {
      case 'neon':
        return new VideoRepositoryNeon();
      case 'supabase':
      default:
        return new VideoRepositorySupabase();
    }
  }

  /**
   * Create a transcript repository instance
   */
  static createTranscriptRepository(): ITranscriptRepository {
    switch (this.activeDatabase) {
      case 'neon':
        return new TranscriptRepositoryNeon();
      case 'supabase':
      default:
        return new TranscriptRepositorySupabase();
    }
  }

  /**
   * Create a summary chapter repository instance
   */
  static createSummaryChapterRepository(): ISummaryRepository {
    switch (this.activeDatabase) {
      case 'neon':
        return new SummaryChapterRepositoryNeon();
      case 'supabase':
      default:
        return new SummaryChapterRepositorySupabase();
    }
  }

  /**
   * Create a summary transcript repository instance
   */
  static createSummaryTranscriptRepository(): ISummaryRepository {
    switch (this.activeDatabase) {
      case 'neon':
        return new SummaryTranscriptRepositoryNeon();
      case 'supabase':
      default:
        return new SummaryTranscriptRepositorySupabase();
    }
  }

  /**
   * Create a video segment repository instance
   */
  static createVideoSegmentRepository(): IVideoSegmentRepository {
    switch (this.activeDatabase) {
      case 'neon':
        return new VideoSegmentRepositoryNeon();
      case 'supabase':
      default:
        return new VideoSegmentRepositorySupabase();
    }
  }
}