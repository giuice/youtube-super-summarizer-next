import axios from "axios";
import Chapter from "@/domain/video_segment/Chapter";
import type { NextApiRequest, NextApiResponse } from "next";
import youtubeChapters from "get-youtube-chapters";


// Retrieve the API key from environment variables
const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;
if (!apiKey) {
  throw new Error("Missing GOOGLE_YOUTUBE_API_KEY in env variables");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;

  if (!videoId) {
    res.status(400).json({ error: "Video ID is required" });
    return;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const response = await axios.get(url);
    const item = response.data.items && response.data.items[0];

    if (!item || !item.snippet || !item.snippet.description) {
      res.status(404).json({ error: `No description found for video ${videoId}` });
      return;
    }

    const description = item.snippet.description;
    const chaptersData = youtubeChapters(description);

    if (!chaptersData || chaptersData.length === 0) {
      res.status(404).json({ error: `No chapters found in video description for video ${videoId}` });
      return;
    }

    // Map parsed chapters to Chapter[]
    const chapters: Chapter[] = chaptersData.map((chapter: any) => ({
      title: chapter.title,
      time: chapter.start,
    })) as Chapter[];

    res.status(200).json(chapters);
  } catch (error: any) {
    res.status(500).json({
      error: `${error} Failed to fetch youtube chapter`,
    });
  }
}