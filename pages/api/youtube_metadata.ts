import axios from "axios";
import { VideoData } from "@/domain/video/VideoData";
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
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const urlMetadata = `https://www.youtube.com/oembed?url=${url}&format=json`;

  try {
    const response = await axios.get(urlMetadata);
    const data =  {
	  video_id: videoId,
      title: response.data.title,
      thumbnail_url: response.data.thumbnail_url,
      author_name: response.data.author_name,
      author_url: response.data.author_url,
      html: response.data.html,
    } as VideoData;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({
        error: `${error} Failed to fetch youtube metadata for ${urlMetadata}`,
      });
  }
}
