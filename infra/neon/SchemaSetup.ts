import neon from "./NeonPostgres";

/**
 * Utility to set up the database schema in Neon PostgreSQL
 */
export class SchemaSetup {
  /**
   * Create all required tables in the Neon PostgreSQL database
   * Tables will be created only if they don't already exist
   */
  static async createTables(): Promise<void> {
    try {
      console.log("Starting database schema setup...");
      
      // Create videos table
      await this.createVideosTable();
      console.log("Videos table created or verified");
      
      // Create transcripts table
      await this.createTranscriptsTable();
      console.log("Transcripts table created or verified");
      
      // Create summary tables
      await this.createSummaryTable("summary_chapters");
      console.log("Summary chapters table created or verified");
      
      await this.createSummaryTable("summary_transcripts");
      console.log("Summary transcripts table created or verified");
      
      // Create video segments table
      await this.createVideoSegmentsTable();
      console.log("Video segments table created or verified");
      
      console.log("Database schema setup completed successfully");
    } catch (error) {
      console.error("Failed to set up database schema:", error);
      throw error;
    }
  }
  
  /**
   * Create the videos table if it doesn't exist
   */
  private static async createVideosTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS videos (
        video_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        author_name TEXT NOT NULL,
        author_url TEXT NOT NULL,
        thumbnail_url TEXT NOT NULL,
        html TEXT NOT NULL
      );
    `;
    
    await neon.query(query);
  }
  
  /**
   * Create the transcripts table if it doesn't exist
   */
  private static async createTranscriptsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS transcripts (
        id SERIAL PRIMARY KEY,
        video_id TEXT NOT NULL,
        transcript JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await neon.query(query);
  }
  
  /**
   * Create a summary table (both for chapters and transcripts) if it doesn't exist
   */
  private static async createSummaryTable(tableName: string): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY, 
        video_id TEXT NOT NULL,
        summary JSONB NOT NULL,
        model TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await neon.query(query);
  }
  
  /**
   * Create the video segments table if it doesn't exist
   */
  private static async createVideoSegmentsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS video_segments (
        id SERIAL PRIMARY KEY,
        video_id TEXT NOT NULL,
        title TEXT,
        start_time BIGINT NOT NULL,
        duration BIGINT NOT NULL,
        content TEXT NOT NULL,
        is_chapter BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Add index for faster lookups by video_id
      CREATE INDEX IF NOT EXISTS idx_video_segments_video_id ON video_segments(video_id);
    `;
    
    await neon.query(query);
  }
}

export default SchemaSetup;
