import type { NextApiRequest, NextApiResponse } from 'next'
import SchemaSetup from '@/infra/neon/SchemaSetup';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add some basic security - you could enhance this with proper auth
    // const adminKey = req.headers['x-admin-key'];
    // if (adminKey !== process.env.ADMIN_API_KEY) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Run the schema setup
    await SchemaSetup.createTables();

    return res.status(200).json({
      success: true,
      message: 'Neon PostgreSQL schema created successfully'
    });
  } catch (error) {
    console.error('Failed to create schema:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}