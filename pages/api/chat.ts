import { NextApiRequest, NextApiResponse } from 'next';
import { ChatService } from '@/domain/chat/ChatService';
import { TranscriptService } from '@/domain/transcript/TranscriptService';
import { OpenAIModel } from '@/domain/model/OpenAIModel';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { ChatRequest, ChatResponse } from '@/domain/chat/ChatMessage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      response: 'Method not allowed',
      error: 'Only POST requests are accepted'
    });
  }

  try {
    const chatRequest = req.body as ChatRequest;
    
    // Initialize services
    const transcriptService = new TranscriptService(
      RepositoryFactory.createTranscriptRepository()
    );
    const languageModel = new OpenAIModel();
    const chatService = new ChatService(transcriptService, languageModel);

    // Process the chat request
    const response = await chatService.processChat(chatRequest);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({
      response: 'An error occurred while processing your request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}