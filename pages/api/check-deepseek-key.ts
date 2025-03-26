import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    const deepseek = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });

    // Make a simple request to check if the API key is valid
    await deepseek.models.list();
    
    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error checking DeepSeek API key:', error);
    return res.status(401).json({ error: 'Invalid API key' });
  }
}