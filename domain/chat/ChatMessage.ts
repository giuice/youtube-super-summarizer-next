export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    videoId: string;
    history: ChatMessage[];
}

export interface ChatResponse {
    response: string;
    error?: string;
}