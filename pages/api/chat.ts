import { NextApiRequest, NextApiResponse } from 'next';
import { ChatService } from '@/domain/chat/ChatService';
import { TranscriptService } from '@/domain/transcript/TranscriptService';
import { OpenAIModel } from '@/domain/model/OpenAIModel';
import { RepositoryFactory } from '@/utils/RepositoryFactory';
import { ChatRequest, ChatResponse } from '@/domain/chat/ChatMessage';
import { DeepSeekModel } from '@/domain/model/DeepSeekModel';


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
    const apiKey = chatRequest.apiKey;
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    const modelName = chatRequest.modelName; // Get model name from request
    if (!modelName) {
      throw new Error('Model name is required in the request'); // Add validation
    }

    // TODO: Define or import ILanguageModel interface/base class if not already done
    // Assuming ILanguageModel is the correct interface/base class for all models
    let languageModel: any; // Using 'any' temporarily. Replace with a proper interface like ILanguageModel

    // Dynamically select the model based on modelName
    switch (modelName) {
      case 'gpt-4o-mini':
        languageModel = new OpenAIModel();
        break;
      case 'deepseek-chat':
        // TODO: Implement DeepSeekModel and ensure it implements the common interface
        // For now, using OpenAI as a placeholder/fallback
        console.warn(`Model ${modelName} not fully implemented yet. Falling back to OpenAI.`);
        languageModel = new DeepSeekModel(); // Temporary fallback
        // Replace with: languageModel = new DeepSeekModel(); when available
        // Or throw: throw new Error(`Model ${modelName} not supported yet.`);
        break;
      default:
        throw new Error(`Unsupported model: ${modelName}`);
    }

    // Configure the selected model
    // Assumes createModel is part of the common model interface
    languageModel.createModel({
      apiKey,
      modelName: modelName, // Use the dynamic modelName
      temperature: 0.4 // Consider making temperature model-specific or configurable
    });
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
