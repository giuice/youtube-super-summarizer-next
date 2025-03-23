// pages/api/transcript_chapters/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { TranscriptData } from '@/domain/transcript/Transcript';
const transcriptService = RepositoryFactory.createTranscriptRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('dentro de transcript_chapters create')
      console.log('req.body', req.body)
      const transcript: TranscriptData = req.body;    
      await transcriptService.create(transcript);
      res.status(200).json({ message: 'transcript created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating transcript', error: error});
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}