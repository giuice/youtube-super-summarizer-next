export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
    videoId?: string;
    isRead?: boolean;
}

export interface ChatRequest {
    message: string;
    videoId: string;
    history: ChatMessage[];
    apiKey: string;
}

export interface ChatResponse {
    response: string;
    error?: string;
}
