import type { NextApiRequest, NextApiResponse } from 'next'
import MigrationUtility from '@/infra/neon/MigrationUtility';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add some basic security
    // const adminKey = req.headers['x-admin-key'];
    // if (adminKey !== process.env.ADMIN_API_KEY) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Get configuration from request body
    const { batchSize, validateData, logProgress } = req.body;

    // Run the migration
    const migrationSummary = await MigrationUtility.migrateAll({
      batchSize: batchSize || 50,
      validateData: validateData !== false,
      logProgress: logProgress !== false
    });

    return res.status(200).json({
      success: true,
      message: 'Data migration to Neon PostgreSQL completed',
      summary: migrationSummary
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}