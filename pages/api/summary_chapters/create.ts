import { NextApiRequest, NextApiResponse } from 'next';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { SummaryData } from '@/domain/summary/SummaryData';
import SummaryService from '@/domain/summary/SummaryService';

const summaryChapterService = new SummaryService(
  RepositoryFactory.createSummaryChapterRepository()
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Creating summary chapter');
      console.log('req.body', req.body);
      const summaryData: SummaryData = req.body;
      await summaryChapterService.create(summaryData);
      res.status(200).json({ message: 'Summary chapter created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating summary chapter', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}