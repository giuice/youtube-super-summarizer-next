import React from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TypingIndicatorProps {
  className?: string;
  variant?: 'default' | 'youtube';
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  className,
  variant = 'youtube'
}) => {
  const youtubeStyle = variant === 'youtube' ? 'bg-primary' : 'bg-muted';
  
  return (
    <Card className={cn("p-3 w-fit", youtubeStyle, className)}>
      {variant === 'youtube' ? (
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#606060] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#606060] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#606060] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      ) : (
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </Card>
  );
};