# YouTube Super Summarizer

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Overview

The **YouTube Super Summarizer** is a Next.js application designed to provide intelligent summarization of YouTube videos. It processes video transcripts and chapters using advanced language models (like OpenAI and DeepSeek) to create concise summaries organized by video segments. Additionally, it allows users to interact with saved transcripts via a chat interface for deeper content understanding.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local Setup & Environment Variables

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
2.  **Configure Environment Variables:**
    *   Create a file named `.env.local` in the project root directory.
    *   Add necessary environment variables to this file. You can setup the database for supabase or neon:
        ```
        SUPABASE_URL=
        SUPABASE_ANON_KEY=
        GOOGLE_YOUTUBE_API_KEY=
        NEON_CONNECTION_STRING=
        ACTIVE_DATABASE=neon
        ```
    *   **IMPORTANT:** The `.env.local` file is included in `.gitignore` by default in Next.js projects and **must never be committed to version control**. It is intended for local secrets and configuration.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
4.  Access your app at [http://localhost:3000](http://localhost:3000).

## Architecture

This project utilizes a clean architecture approach based on **Domain-Driven Design (DDD)** principles to ensure a clear separation of concerns and maintainability. Key architectural patterns include:

*   **Layered Architecture:** The codebase is organized into distinct layers:
    *   `/pages` & `/components`: Presentation Layer (Next.js pages, React UI components).
    *   `/application`: Application Layer (Orchestrates use cases, e.g., `VideoDataService`).
    *   `/domain`: Domain Layer (Core business logic, entities, value objects, and domain services). This is the heart of the application.
    *   `/infra`: Infrastructure Layer (Handles external concerns like database interactions (Supabase, MongoDB), API clients, etc.).
*   **Repository Pattern:** Data access logic is abstracted through repository interfaces defined in the `/domain` layer, with implementations residing in the `/infra` layer. This decouples the domain logic from specific database technologies.
*   **SOLID Principles:** The design aims to adhere to SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) to create a flexible and robust system.
*   **Dependency Rule:** Dependencies flow inwards: Presentation → Application → Domain ← Infrastructure. The Domain layer has no knowledge of the outer layers.

**Key Directories:**

*   `/application`: Contains services that coordinate application tasks.
*   `/components`: Reusable React UI components.
*   `/domain`: Core business logic, models (e.g., `Video`, `Summary`, `Transcript`), interfaces, and services.
*   `/infra`: Implementations for data persistence (e.g., Supabase client) and external services.
*   `/lib`: Shared utility functions and configurations.
*   `/pages`: Next.js page routes and API endpoints.

## Database Structure (Supabase Example)

```sql
CREATE TABLE videos (
  video_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  author_name TEXT NOT NULL,
  author_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  html TEXT NOT NULL -- Consider if this is still needed or how it's used
);

CREATE TABLE transcripts (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
  transcript JSONB NOT NULL, -- Array of {duration, start, text}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_segments (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
  title TEXT,
  start_time BIGINT NOT NULL, -- in milliseconds
  duration BIGINT NOT NULL, -- in milliseconds
  content TEXT NOT NULL,
  is_chapter BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE summary_chapters (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
  summary JSONB NOT NULL, -- Array of {text, minuteStarting, duration, formattedDuration, title}
  model TEXT NOT NULL, -- e.g., 'openai', 'deepseek'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE summary_transcripts (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
  summary JSONB NOT NULL, -- Array of {text, minuteStarting, duration, formattedDuration}
  model TEXT NOT NULL, -- e.g., 'openai', 'deepseek'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
*Note: Added foreign key constraints for data integrity.*

## Site URL (Example Deployment)

[Site url](https://youtube-super-summarizer-next.vercel.app/)
*Note: Supabase free tier databases may pause after periods of inactivity.*

---

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on `http://localhost:3000/api/...`. These endpoints are defined in the `pages/api/` directory.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
