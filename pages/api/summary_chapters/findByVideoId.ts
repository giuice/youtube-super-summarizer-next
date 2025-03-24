import { NextApiRequest, NextApiResponse } from 'next';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import SummaryService from '@/domain/summary/SummaryService';

const summaryChapterService = new SummaryService(
  RepositoryFactory.createSummaryChapterRepository()
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { videoId } = req.query;
      
      if (!videoId || typeof videoId !== 'string') {
        return res.status(400).json({ message: 'Video ID is required' });
      }
      
      const summary = await summaryChapterService.findByVideoId(videoId);
      
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: 'Error finding summary chapter', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}