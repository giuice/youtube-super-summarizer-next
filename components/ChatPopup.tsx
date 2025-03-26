import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { ChatHistoryService } from "@/domain/chat/ChatHistoryService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  videoId?: string;
}

interface ChatPopupProps {
  show: boolean;
  onClose: () => void;
  videoId: string;
}

export const ChatPopup: React.FC<ChatPopupProps> = ({ show, onClose, videoId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      const history = ChatHistoryService.getHistory(videoId);
      setMessages(history.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }
  }, [show, videoId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
      videoId
    };

    setMessages(prev => [...prev, userMessage]);
    ChatHistoryService.saveMessage(videoId, userMessage);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Get the selected model from localStorage
    const selectedModel = localStorage.getItem('selected_model') || 'gpt-4o-mini';
    // Get the API key specific to the model
    const modelKeyName = `${selectedModel}_api_key`;
    const apiKey = localStorage.getItem(modelKeyName) || '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          videoId,
          history: messages,
          apiKey: apiKey,
          modelName: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
          videoId
        };
        setIsTyping(false);
        setMessages(prev => [...prev, assistantMessage]);
        ChatHistoryService.saveMessage(videoId, assistantMessage);
      }, 700);
      
    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col bg-white dark:bg-gray-900 border shadow-lg" style={{ backgroundColor: 'var(--background)', opacity: 1 }}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">Chat with Video Content</DialogTitle>
            {messages.length > 0 && (
              <Button
                variant="daisySecondary"
                size="sm"
                onClick={() => {
                  ChatHistoryService.clearHistory(videoId);
                  setMessages([]);
                }}
                className="text-muted-content hover:text-destructive"
              >
                Clear History
              </Button>
            )}
          </div>
          <DialogDescription>
            Ask questions about the video content
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <Card className="p-6">
              <div className="text-center text-muted-content">
                <p>Ask questions about the video content!</p>
                <p className="text-sm mt-2">Examples:</p>
                <ul className="text-sm mt-1 space-y-1">
                  <li>• What is the main topic?</li>
                  <li>• Summarize the key points</li>
                  <li>• Explain the concept at 2:35</li>
                </ul>
              </div>
            </Card>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-2",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className={cn(
                "w-8 h-8",
                message.role === 'user' ? "bg-secondary" : "bg-primary"
              )}>
                <AvatarFallback className={cn(
                  message.role === 'user' ? "text-secondary-content" : "text-primary-content"
                )}>
                  {message.role === 'user' ? 'You' : 'AI'}
                </AvatarFallback>
              </Avatar>
              
              <Card className={cn(
                "p-3 max-w-[75%]",
                message.role === 'user' 
                  ? "bg-primary text-primary-content" 
                  : "bg-muted text-muted-content"
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} >
                  {message.content}</ReactMarkdown>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-2">
              <Avatar className="w-8 h-8 bg-primary">
                <AvatarFallback className="text-primary-content">AI</AvatarFallback>
              </Avatar>
              <TypingIndicator variant="youtube" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about the video content..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputMessage.trim()}
            variant="daisyPrimary"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-content" />
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
