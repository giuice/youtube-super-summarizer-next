	// pages/api/transcript.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' });
    return;
  }

  try {
	console.log('dentro de transcript route')
    const transcript = await YoutubeTranscript.fetchTranscript(videoId as string) ;
    res.status(200).json(transcript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
}
