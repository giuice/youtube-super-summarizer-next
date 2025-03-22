# "Talk with Transcription" Chat Feature Implementation Instructions

## Objective
Implement a chat popup feature that allows users to interact with and ask questions about YouTube video transcripts, using language models (OpenAI/DeepSeek) to provide contextual responses based on the transcript content.

## Context
- The YouTube Super Summarizer already processes and stores video transcripts
- This feature will enhance user experience by allowing direct interaction with the video content
- Chat popup will appear above the summarized section
- Chat will only retain memory for the current conversation session
- No new fetching of transcripts will occur during chat - only use existing stored transcripts

## Dependencies
- domain_transcript: Need access to stored transcript data
- domain_model: Language models (OpenAI/DeepSeek) for chat responses
- components_summary: UI integration with existing summary components
- infra_supabase: Current data storage (will be migrated to Neon PostgreSQL)

## Steps

### 1. Create Chat UI Components
- Create a new ChatPopup.tsx component
- Implement chat message display area
- Add input field for user questions
- Style the component to appear above summary sections
- Add toggle functionality to show/hide the chat interface

### 2. Implement Chat Service
- Create domain/chat/ChatService.ts for handling chat logic
- Implement message history management
- Define interfaces for chat messages and responses
- Configure connection to language models (reuse existing model classes)

### 3. Set Up Context Processing
- Create utility to format transcript content for context
- Implement relevancy scoring for finding transcript sections related to queries
- Create domain/chat/TranscriptProcessor.ts for processing transcript data

### 4. Connect UI to Backend
- Add API endpoint for chat interactions
- Implement client-side service for API communication
- Connect ChatPopup component to the chat service
- Handle loading states and error conditions

### 5. Test and Refine
- Test with various transcript types and lengths
- Validate memory retention within a single session
- Optimize prompt engineering for best responses
- Add unit tests for core functionality

## Expected Output
- Functional chat popup component integrated with the existing UI
- Backend service handling chat processing with language models
- API endpoint for chat interactions
- Smooth integration with existing transcript data

## Notes
- Chat feature should be togglable (on/off)
- Consider implementing typing indicators for better UX
- Response quality will depend on transcript quality and language model capabilities
- Future enhancement may include saving chat history