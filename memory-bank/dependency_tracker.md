---TRACKER_START---
# Module Dependencies for YouTube Super Summarizer Next.js
# Format: Module|File = Dependencies
# Dependencies: REQ=requires, PROV=provides to, DOC=documentation
# Additional types: MUT=mutual dependency, SEM=semantic relationship, NO=verified no dependency

# Domain Layer
domain_model = PROV:domain_summary,domain_transcript,domain_video,domain_video_segment
domain_summary = REQ:domain_model PROV:infra_summary_repo_supabase,infra_summary_repo_neon,infra_supabase
domain_transcript = REQ:domain_model PROV:infra_transcript_repo_supabase,infra_transcript_repo_neon,domain_video_segment
domain_video = REQ:domain_model PROV:infra_video_repo_supabase,infra_video_repo_neon,application_video_service
domain_video_segment = REQ:domain_model,domain_transcript PROV:infra_video_segment_repo_supabase,infra_video_segment_repo_neon

# Application Layer
application_video_service = REQ:domain_video,domain_video_segment,domain_transcript,domain_summary,utils_repository_factory PROV:components_video

# Infrastructure Layer
infra_mongodb = PROV:infra_summary_repo_mongo
infra_summary_repo_mongo = REQ:infra_mongodb,domain_summary
infra_supabase = PROV:infra_summary_repo_supabase,infra_transcript_repo_supabase,infra_video_repo_supabase,infra_video_segment_repo_supabase,infra_migration_utility
infra_summary_repo_supabase = REQ:infra_supabase,domain_summary PROV:utils_repository_factory
infra_transcript_repo_supabase = REQ:infra_supabase,domain_transcript PROV:utils_repository_factory
infra_video_repo_supabase = REQ:infra_supabase,domain_video PROV:utils_repository_factory
infra_video_segment_repo_supabase = REQ:infra_supabase,domain_video_segment PROV:utils_repository_factory

# Neon PostgreSQL Implementation
infra_neon = PROV:infra_summary_repo_neon,infra_transcript_repo_neon,infra_video_repo_neon,infra_video_segment_repo_neon,infra_schema_setup,infra_migration_utility
infra_summary_repo_neon = REQ:infra_neon,domain_summary PROV:utils_repository_factory
infra_transcript_repo_neon = REQ:infra_neon,domain_transcript PROV:utils_repository_factory
infra_video_repo_neon = REQ:infra_neon,domain_video PROV:utils_repository_factory
infra_video_segment_repo_neon = REQ:infra_neon,domain_video_segment PROV:utils_repository_factory
infra_schema_setup = REQ:infra_neon
infra_migration_utility = REQ:infra_neon,infra_supabase

# Utilities
utils_repository_factory = REQ:infra_summary_repo_supabase,infra_transcript_repo_supabase,infra_video_repo_supabase,infra_video_segment_repo_supabase,infra_summary_repo_neon,infra_transcript_repo_neon,infra_video_repo_neon,infra_video_segment_repo_neon PROV:application_video_service

# UI Components
components_video = REQ:application_video_service
components_summary = REQ:domain_summary,domain_video_segment
components_pagination = NO:domain_model

# API Endpoints
api_youtube_metadata = REQ:domain_video,application_video_service
api_transcript = REQ:domain_transcript
api_chapter = REQ:domain_video_segment
api_summary_transcripts = REQ:domain_summary,domain_transcript
---TRACKER_END---

---KEYS_START---
# Domain Layer
domain_model: domain/model
domain_summary: domain/summary
domain_transcript: domain/transcript
domain_video: domain/video
domain_video_segment: domain/video_segment

# Application Layer
application_video_service: application/VideoDataService.ts

# Infrastructure Layer
infra_mongodb: infra/mongodb
infra_summary_repo_mongo: infra/mongodb/SummaryRepositoryMongo.ts
infra_supabase: infra/supabase
infra_summary_repo_supabase: infra/supabase/SummaryRepositorySupabase.ts
infra_transcript_repo_supabase: infra/supabase/TranscriptRepositorySupabase.ts
infra_video_repo_supabase: infra/supabase/VideoRepositorySupabase.ts
infra_video_segment_repo_supabase: infra/supabase/VideoSegmentRepositorySupabase.ts

# Neon PostgreSQL Implementation
infra_neon: infra/neon/NeonPostgres.ts
infra_summary_repo_neon: infra/neon/SummaryRepositoryNeon.ts
infra_transcript_repo_neon: infra/neon/TranscriptRepositoryNeon.ts
infra_video_repo_neon: infra/neon/VideoRepositoryNeon.ts
infra_video_segment_repo_neon: infra/neon/VideoSegmentRepositoryNeon.ts
infra_schema_setup: infra/neon/SchemaSetup.ts
infra_migration_utility: infra/neon/MigrationUtility.ts

# Utilities
utils_repository_factory: utils/RepositoryFactory.ts

# UI Components
components_video: components/VideoSummarizer.tsx,components/VideoModal.tsx,components/VideoTitleList.tsx
components_summary: components/SummaryList.tsx,components/SummaryItem.tsx,components/SummaryChaptersList.tsx,components/SummaryChaptersItem.tsx,components/DocumentSummarizer.tsx
components_pagination: components/Pagination.tsx

# API Endpoints
api_youtube_metadata: pages/api/youtube_metadata.ts
api_transcript: pages/api/transcript.ts
api_chapter: pages/api/chapter.ts,pages/api/get_chapters.ts
api_summary_transcripts: pages/api/summary_transcripts/create.ts
---KEYS_END---