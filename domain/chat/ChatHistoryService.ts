import { ChatMessage } from './ChatMessage';

const CHAT_HISTORY_KEY = 'youtube-summarizer-chat-history';

export class ChatHistoryService {
    private static getStorageKey(videoId: string): string {
        return `${CHAT_HISTORY_KEY}:${videoId}`;
    }

    static saveMessage(videoId: string, message: ChatMessage): void {
        const key = this.getStorageKey(videoId);
        const history = this.getHistory(videoId);
        history.push(message);
        localStorage.setItem(key, JSON.stringify(history));
    }

    static getHistory(videoId: string, page = 1, pageSize = 10): ChatMessage[] {
        const key = this.getStorageKey(videoId);
        const rawData = localStorage.getItem(key);
        if (!rawData) return [];

        const allMessages = JSON.parse(rawData) as ChatMessage[];
        if (page === 1 && pageSize >= allMessages.length) {
            return allMessages;
        }

        const startIndex = Math.max(0, allMessages.length - (page * pageSize));
        const endIndex = allMessages.length - ((page - 1) * pageSize);
        return allMessages.slice(startIndex, endIndex).reverse();
    }

    static clearHistory(videoId: string): void {
        const key = this.getStorageKey(videoId);
        localStorage.removeItem(key);
    }

    static getTotalPages(videoId: string, pageSize = 10): number {
        const key = this.getStorageKey(videoId);
        const rawData = localStorage.getItem(key);
        if (!rawData) return 0;

        const allMessages = JSON.parse(rawData) as ChatMessage[];
        return Math.ceil(allMessages.length / pageSize);
    }
}