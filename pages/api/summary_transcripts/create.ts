// // pages/api/summary_chapters/create.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { SummaryData } from '../../../domain/summary/SummaryData';
// import { SummaryService } from '../../../domain/summary/SummaryService';
// import { SummaryRepositorySupabase } from '../../../infra/supabase/SummaryRepositorySupabase';

// const summaryService = new SummaryService(new SummaryRepositorySupabase('summary_chapters'));

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const summary: SummaryData = req.body;
//       await summaryService.create(summary);
//       res.status(200).json({ message: 'Summary created successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating summary', error: error});
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }