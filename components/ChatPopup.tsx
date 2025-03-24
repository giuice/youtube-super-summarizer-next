import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

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
          apiKey: localStorage.getItem('openai_api_key') || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }]);
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
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with Video Content</DialogTitle>
          <DialogDescription>
            Ask questions about the video content
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">
              <p>Ask questions about the video content!</p>
              <p className="text-sm mt-2">Examples:</p>
              <ul className="text-sm mt-1 space-y-1">
                <li>• What is the main topic?</li>
                <li>• Summarize the key points</li>
                <li>• Explain the concept at 2:35</li>
              </ul>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2 shrink-0">
                  AI
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-2'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground ml-2 shrink-0">
                  You
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2 shrink-0">
                AI
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
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
          <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
