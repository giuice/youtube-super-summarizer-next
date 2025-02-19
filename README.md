This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a .env.local file in the project root to add any required local configurations (e.g., Supabase API keys).
3. Run the app locally:
   ```bash
   npm run dev
   ```
4. Access your app at [http://localhost:3000](http://localhost:3000).

## Database structure
```sql
CREATE TABLE videos (
  video_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  author_name TEXT NOT NULL,
  author_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  html TEXT NOT NULL
);

CREATE TABLE transcripts (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  transcript JSONB NOT NULL, -- Array of {duration, start, text}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_segments (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  title TEXT,
  start_time BIGINT NOT NULL, -- in milliseconds
  duration BIGINT NOT NULL, -- in milliseconds
  content TEXT NOT NULL,
  is_chapter BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE summary_chapters (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  summary JSONB NOT NULL, -- Array of {text, minuteStarting, duration, formattedDuration, title}
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE summary_transcripts (
  id SERIAL PRIMARY KEY, 
  video_id TEXT NOT NULL,
  summary JSONB NOT NULL, -- Array of {text, minuteStarting, duration, formattedDuration}
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Site URL using supabase
[Site url](https://youtube-super-summarizer-next.vercel.app/)
Supabase has 5 days to freeze databases...


You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
