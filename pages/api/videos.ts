import { NextApiRequest, NextApiResponse } from 'next';
import { VideoService } from '@/domain/video/VideoService';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import  ApiError  from '@/utils/ApiError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const videoService = new VideoService(RepositoryFactory.createVideoRepository());
    const videos = await videoService.getAll();
    return res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    if (error instanceof ApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}