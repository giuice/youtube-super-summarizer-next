import { NextApiRequest, NextApiResponse } from 'next';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { VideoData } from '@/domain/video/VideoData';
import VideoService from '@/domain/video/VideoService';

const videoService = new VideoService(
  RepositoryFactory.createVideoRepository()
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Creating video metadata');
      console.log('req.body', req.body);
      const videoData: VideoData = req.body;
      await videoService.create(videoData);
      res.status(200).json({ message: 'Video metadata created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating video metadata', error: error});
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}