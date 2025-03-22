---TRACKER_START---
# Module Dependencies for YouTube Super Summarizer Next.js
# Format: Module|File = Dependencies
# Dependencies: REQ=requires, PROV=provides to, DOC=documentation
# Additional types: MUT=mutual dependency, SEM=semantic relationship, NO=verified no dependency

# Domain Layer
domain_model = PROV:domain_summary,domain_transcript,domain_video,domain_video_segment
domain_summary = REQ:domain_model PROV:infra_summary_repo,infra_supabase
domain_transcript = REQ:domain_model PROV:infra_transcript_repo,domain_video_segment
domain_video = REQ:domain_model PROV:infra_video_repo,application_video_service
domain_video_segment = REQ:domain_model,domain_transcript PROV:infra_video_segment_repo

# Application Layer
application_video_service = REQ:domain_video,domain_video_segment,domain_transcript,domain_summary PROV:components_video

# Infrastructure Layer
infra_mongodb = PROV:infra_summary_repo_mongo
infra_summary_repo_mongo = REQ:infra_mongodb,domain_summary
infra_supabase = PROV:infra_summary_repo_supabase,infra_transcript_repo,infra_video_repo,infra_video_segment_repo
infra_summary_repo_supabase = REQ:infra_supabase,domain_summary
infra_transcript_repo = REQ:infra_supabase,domain_transcript
infra_video_repo = REQ:infra_supabase,domain_video
infra_video_segment_repo = REQ:infra_supabase,domain_video_segment

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
infra_transcript_repo: infra/supabase/TranscriptRepositorySupabase.ts
infra_video_repo: infra/supabase/VideoRepositorySupabase.ts
infra_video_segment_repo: infra/supabase/VideoSegmentRepositorySupabase.ts

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