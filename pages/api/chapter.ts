import axios from "axios";
import Chapter from "@/domain/video_segment/Chapter";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const url = `https://yt.lemnoslife.com/videos?part=chapters&id=${videoId}`;
    const response = await axios.get(url);
    if (
      !response.data.items ||
      !response.data.items[0] ||
      !response.data.items[0].chapters ||
      !response.data.items[0].chapters.chapters
    ) {
      res.status(404).json({ error: `No chapters found for video ${videoId}` });
      return;
    }
    const chapters : Chapter[] = response.data.items[0].chapters.chapters.map(
      (chapter: any) => ({
        title: chapter.title,
        time: chapter.time,
      })
    );
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({
      error: `${error} Failed to fetch youtube chapter`,
    });
  }
}
