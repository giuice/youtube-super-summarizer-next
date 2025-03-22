import { TranscriptService } from '../transcript/TranscriptService';
import { BaseLanguageModel } from '../model/BaseLanguageModel';
import { ChatMessage, ChatRequest, ChatResponse } from './ChatMessage';
import { TranscriptData } from '../transcript/Transcript';

export class ChatService {
    constructor(
        private transcriptService: TranscriptService,
        private languageModel: BaseLanguageModel
    ) {}

    private formatTranscript(transcript: TranscriptData): string {
        return transcript.transcript
            .map(entry => `[${this.formatTime(entry.start)}] ${entry.text}`)
            .join('\n');
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    async processChat(request: ChatRequest): Promise<ChatResponse> {
        try {
            // Fetch transcript for the video
            const transcript = await this.transcriptService.findByVideoId(request.videoId);
            if (!transcript) {
                return {
                    response: "Sorry, I couldn't find the transcript for this video.",
                    error: "Transcript not found"
                };
            }

            // Format the conversation history and current message
            const messages = [
                {
                    role: "system",
                    content: `You are an AI assistant helping users understand a YouTube video. 
                    Answer questions based only on the video transcript content. Include timestamp references when relevant.
                    Here's the transcript with timestamps:\n\n${this.formatTranscript(transcript)}`
                },
                ...request.history,
                { role: "user", content: request.message }
            ];

            // Get response from language model
            const response = await this.languageModel.chat(messages);

            return {
                response: response
            };
        } catch (error) {
            console.error('Error in chat service:', error);
            return {
                response: "I apologize, but I encountered an error while processing your request.",
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
}