import { NextApiRequest, NextApiResponse } from 'next';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { SummaryData } from '@/domain/summary/SummaryData';
import SummaryService from '@/domain/summary/SummaryService';

const summaryTranscriptService = new SummaryService(
  RepositoryFactory.createSummaryTranscriptRepository()
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Creating summary transcript');
      console.log('req.body', req.body);
      const summaryData: SummaryData = req.body;
      await summaryTranscriptService.create(summaryData);
      res.status(200).json({ message: 'Summary transcript created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating summary transcript', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}