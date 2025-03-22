import { ChatService } from '@/domain/chat/ChatService';
import { TranscriptService } from '@/domain/transcript/TranscriptService';
import { BaseLanguageModel } from '@/domain/model/BaseLanguageModel';
import { ChatRequest } from '@/domain/chat/ChatMessage';

describe('ChatService', () => {
  let chatService: ChatService;
  let mockTranscriptService: jest.Mocked<TranscriptService>;
  let mockLanguageModel: jest.Mocked<BaseLanguageModel>;

  beforeEach(() => {
    mockTranscriptService = {
      findByVideoId: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<TranscriptService>;

    mockLanguageModel = {
      chat: jest.fn(),
      createModel: jest.fn(),
    } as unknown as jest.Mocked<BaseLanguageModel>;

    chatService = new ChatService(mockTranscriptService, mockLanguageModel);
  });

  describe('processChat', () => {
    const mockRequest: ChatRequest = {
      message: 'What is this video about?',
      videoId: 'test-video-id',
      history: []
    };

    const mockTranscript = {
      video_id: 'test-video-id',
      transcript: [
        { start: 0, duration: 10, text: 'This is a test video' },
        { start: 10, duration: 10, text: 'About testing chat functionality' }
      ]
    };

    it('should return transcript not found error when no transcript exists', async () => {
      mockTranscriptService.findByVideoId.mockResolvedValue(null);

      const result = await chatService.processChat(mockRequest);

      expect(result.error).toBe('Transcript not found');
      expect(result.response).toContain("couldn't find the transcript");
    });

    it('should process chat request successfully', async () => {
      mockTranscriptService.findByVideoId.mockResolvedValue(mockTranscript);
      mockLanguageModel.chat.mockResolvedValue('This is a test response');

      const result = await chatService.processChat(mockRequest);

      expect(result.error).toBeUndefined();
      expect(result.response).toBe('This is a test response');
      expect(mockLanguageModel.chat).toHaveBeenCalled();
    });

    it('should handle errors during chat processing', async () => {
      mockTranscriptService.findByVideoId.mockRejectedValue(new Error('Database error'));

      const result = await chatService.processChat(mockRequest);

      expect(result.error).toBe('Database error');
      expect(result.response).toContain('encountered an error');
    });

    it('should format transcript with timestamps correctly', async () => {
      mockTranscriptService.findByVideoId.mockResolvedValue(mockTranscript);
      mockLanguageModel.chat.mockResolvedValue('Test response');

      await chatService.processChat(mockRequest);

      const callArgs = mockLanguageModel.chat.mock.calls[0][0];
      const systemMessage = callArgs.find((msg: any) => msg.role === 'system');
      
      expect(systemMessage.content).toContain('[0:00] This is a test video');
      expect(systemMessage.content).toContain('[0:10] About testing chat functionality');
    });
  });
});