# Database Migration from Supabase to Neon PostgreSQL Instructions

## Objective
Migrate the existing database from Supabase to Neon PostgreSQL while maintaining data integrity and ensuring seamless functionality of all application features.

## Context
- The YouTube Super Summarizer currently uses Supabase for data storage
- Neon PostgreSQL has been selected as the new database platform
- All existing data (videos, transcripts, summaries) must be migrated without loss
- API endpoints need to be updated to work with the new database
- The application follows a repository pattern which should facilitate the migration

## Dependencies
- infra_supabase: Current database implementation (source)
- domain_video: Video data that needs to be migrated
- domain_transcript: Transcript data that needs to be migrated
- domain_summary: Summary data that needs to be migrated
- domain_video_segment: Video segment data that needs to be migrated
- api_youtube_metadata, api_transcript, api_chapter, api_summary_transcripts: API endpoints that need updating

## Steps

### 1. Set Up Neon PostgreSQL
- Create a Neon PostgreSQL account and project
- Set up database schema matching current Supabase structure
- Configure connection settings and environment variables
- Test basic connection from the application

### 2. Create Repository Implementations
- Create infra/neon/NeonPostgres.ts for database connection
- Implement repository classes for each domain:
  - VideoRepositoryNeon.ts
  - TranscriptRepositoryNeon.ts
  - SummaryRepositoryNeon.ts
  - VideoSegmentRepositoryNeon.ts
- Ensure each repository implements the respective interface (IVideoRepository, etc.)

### 3. Develop Migration Script
- Create a migration utility to export data from Supabase
- Implement import functionality for Neon PostgreSQL
- Add data validation to ensure integrity during migration
- Include logging for tracking migration progress and issues

### 4. Update API Endpoints
- Modify API endpoints to use Neon repositories instead of Supabase
- Implement configuration-based repository selection
- Add feature flag for gradual rollout
- Update error handling for Neon-specific errors

### 5. Test Migration and Functionality
- Perform test migration with subset of data
- Validate data integrity after migration
- Test all application features with the new database
- Create rollback plan in case of issues

### 6. Production Migration
- Schedule maintenance window for migration
- Execute full data migration
- Switch application to use Neon repositories
- Monitor application performance and data integrity

## Expected Output
- Fully functional Neon PostgreSQL database with all migrated data
- Updated repository implementations for all domain entities
- Modified API endpoints working with the new database
- Migration scripts and documentation
- Verified application functionality with the new database

## Notes
- Consider implementing database access abstraction to make future migrations easier
- Database connection strings should be environment variables, not hardcoded
- Maintain both Supabase and Neon implementations during transition period
- Consider implementing database versioning to track schema changes