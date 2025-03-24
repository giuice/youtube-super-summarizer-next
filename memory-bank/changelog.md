# Changelog

## [Unreleased]

### Added
- Support for Next.js 15.2.3
- Support for Tailwind CSS 4.0.15
- Support for React 19.0.0
- Theme system implementation with next-themes
- ThemeProvider component for centralized theme management
- ThemeToggle component with light/dark mode switching
- Theme configuration with custom light/dark theme variables

### Changed
- Updated development server to use turbopack with flag `--turbopack`
- Updated dependency tracker to include framework versions
- Updated TypeScript to 5.8.2
- Updated _app.tsx to include ThemeProvider wrapper

### Removed
- Legacy postcss configuration

## March 24, 2025
- Removed react-bootstrap dependency
- Migrated VideoModal component from react-bootstrap Modal to shadcn Dialog
- Updated dependency tracker to reflect UI component changes
- Updated component dependencies to use shadcn UI system

## March 22, 2025

### Database Migration Completed
- **Completed**: Successfully migrated all data from Supabase to Neon PostgreSQL
- **Verified**: Data integrity validation passed for all entities
- **Updated**: Environment configuration to use Neon PostgreSQL as primary database
- **Removed**: NEXT_PUBLIC prefix from database environment variables
- **Fixed**: Client-side repository access issues
- **Tested**: All integration tests passing with new database

### Chat Feature Implementation
- **Added**: Chat UI components with real-time interaction
- **Added**: ChatService with language model integration
- **Added**: Chat API endpoint for transcript-based conversations
- **Added**: Unit tests for chat components and services

## March 22, 2025

### Database Migration Implementation
- **Added**: `infra/neon/NeonPostgres.ts` for Neon PostgreSQL connection management
- **Added**: Repository implementations for all domain entities in `infra/neon/` directory:
  - `VideoRepositoryNeon.ts`
  - `TranscriptRepositoryNeon.ts`
  - `SummaryRepositoryNeon.ts`
  - `VideoSegmentRepositoryNeon.ts`
- **Added**: `infra/neon/SchemaSetup.ts` utility for database table creation
- **Added**: `infra/neon/MigrationUtility.ts` for data transfer from Supabase to Neon
- **Added**: `utils/RepositoryFactory.ts` to dynamically select between Supabase and Neon repositories
- **Updated**: `application/VideoDataService.ts` to use the RepositoryFactory pattern
- **Fixed**: Missing `create` method in `VideoSegmentRepositoryNeon.ts`

### Next Steps
- Set up Neon PostgreSQL account and configure environment variables
- Execute schema setup and data migration
- Test application with the new database implementation

## March 21, 2025

### CRCT System Transition to Strategy Phase
- **Updated**: `.memorybankrules` file to transition from Set-up/Maintenance to Strategy phase
- **Created**: `memory-bank/strategy-tasks/chat_feature_instructions.md` for "Talk with Transcription" feature
- **Created**: `memory-bank/strategy-tasks/database_migration_instructions.md` for Neon PostgreSQL migration
- **Updated**: `memory-bank/activeContext.md` to reflect current strategic priorities and task ordering

### Previous Updates
- **Added**: `.memorybankrules` file to initialize CRCT system in Set-up/Maintenance phase
- **Created**: Dependency tracker for modules in `memory-bank/dependency_tracker.md`
- **Created**: Documentation tracker in `memory-bank/doc_tracker.md`
- **Updated**: `memory-bank/activeContext.md` to reflect current CRCT system setup and project status

### Next Steps
- Begin execution of prioritized tasks
- Implement chat feature UI components
- Set up Neon PostgreSQL environment
- Track progress in `memory-bank/progress.md`

## v1.1 (Upcoming)
- **New Feature:** Add "Talk with Transcription" chat popup.
- **Database Migration:** Move from Supabase to Neon PostgreSQL.
- **Infrastructure Update:** Updated database connection strings and optimized API responses.
- **Bug Fixes:** Improved transcript retrieval performance.