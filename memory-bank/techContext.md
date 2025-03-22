# Technical Context:

## Technologies Used:
* **Frontend Framework:** Next.js (v13.4.13), React (v18.2.0)
* **Programming Languages:** TypeScript, JavaScript
* **Database:** Supabase, MongoDB
* **AI/ML Integration:** LangChain, OpenAI, DeepSeek
* **Styling:** CSS, likely some Tailwind (based on tailwind.config.js.old file)
* **API Integration:** YouTube Transcript API, YouTube Chapters

## Development Setup:
* **Operating System:** Windows
* **Package Manager:** npm/yarn
* **Environment Variables:** 
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Likely has OpenAI and other API keys

## Technical Constraints:
* **LLM Context Window:** LLMs have a limited context window, requiring careful management of the amount of information passed to and from the LLM.
* **API Rate Limits:** YouTube API, OpenAI, and other services may have rate limits.
* **Computational Resources:** Running LLMs and managing large datasets can be computationally intensive.
* **Supabase and MongoDB Integration:** Need to handle database connections properly.

## Dependencies:
### Main Framework:
* next (13.4.13)
* react (18.2.0)
* react-dom (18.2.0)
* typescript (5.1.6)

### Database & Backend:
* @supabase/supabase-js (2.48.1)
* supabase (1.83.7)
* mongodb (5.2.0)

### AI and Language Models:
* @langchain/core (0.3.39)
* @langchain/deepseek (0.0.1)
* @langchain/openai (0.4.2)
* @langchain/textsplitters (0.1.0)
* langchain (0.3.15)
* tiktoken (1.0.10)

### YouTube Integration:
* get-youtube-chapters (2.0.0)
* youtube-transcript (1.2.1)

### UI Components:
* react-bootstrap (2.7.4)
* reactstrap (9.1.9)
* @fortawesome/fontawesome-svg-core (6.4.2)
* @fortawesome/free-solid-svg-icons (6.4.2)
* @fortawesome/react-fontawesome (0.2.0)
* react-markdown (9.0.3)
* remark-gfm (4.0.0)

### Utilities:
* axios (1.4.0)

### Development Tools:
* eslint (8.46.0)
* eslint-config-next (13.4.13)
* @types/node (20.4.9)
* @types/react (18.2.20)
* @types/react-dom (18.2.7)

## Project Structure:
The project follows a domain-driven design with clear separation of concerns:

* `/application` - Application services (e.g., VideoDataService)
* `/components` - React components for UI
* `/domain` - Core business logic and models
  * `/model` - Language models (BaseLanguageModel, DeepSeekModel, OpenAIModel)
  * `/summary` - Summary-related domain entities and services
  * `/transcript` - Transcript-related domain entities and services
  * `/video` - Video-related domain entities and services
  * `/video_segment` - Video segment related entities (chapters, etc.)
* `/infra` - Infrastructure layer
  * `/mongodb` - MongoDB integration
  * `/supabase` - Supabase integration
* `/pages` - Next.js pages and API routes
* `/public` - Static assets
* `/styles` - CSS and styling
* `/utils` - Utility functions
* `/memory-bank` - Project documentation and context

## Dependency Graph:
The application follows a clean architecture pattern with dependencies pointing inward:
- UI Components → Application Services → Domain Services → Domain Entities
- Infrastructure implementations (MongoDB, Supabase) → Domain Repositories (Interfaces)
