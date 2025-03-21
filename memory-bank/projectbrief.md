# Project Brief: YouTube Super Summarizer

**Project Name:** YouTube Super Summarizer

**Project Goal:** A Next.js application that provides intelligent summarization of YouTube videos by processing their transcripts and chapters, using advanced language models to create concise, meaningful summaries organized by video segments.

**Core Requirements:**

1. Video Processing:
   - Fetch and process YouTube video metadata and transcripts
   - Support both chapter-based and time-based video segmentation
   - Handle videos with and without chapters

2. Summarization Features:
   - Intelligent summarization using multiple language model options (OpenAI, DeepSeek)
   - Support for different summarization strategies (transcript-based and chapter-based)
   - Maintain original language of the content in summaries
   - Segment long videos into manageable chunks for processing

3. Data Management:
   - Store video metadata (title, author, thumbnail, etc.)
   - Cache transcripts and summaries for quick retrieval
   - Support for multiple summary versions using different models
   - Organize summaries by video segments with timing information

4. User Interface:
   - Video search and browsing capabilities
   - Real-time summarization progress display
   - Clean presentation of summaries with timing information
   - Pagination for video listings
   - Modal-based video preview

5. Technical Architecture:
   - Domain-driven design with clear separation of concerns
   - Repository pattern for data access
   - Service layer for business logic
   - Supabase integration for data persistence
   - Support for multiple language model providers
   - Error handling and API response management

**Source of Truth:** This document serves as the source of truth for the project's scope, core requirements, and overall vision. All other documentation and development efforts should align with the principles and goals outlined here.
