import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoListCardProps {
  title: string;
  children: React.ReactNode;
}

export const VideoListCard: React.FC<VideoListCardProps> = ({ title, children }) => {
  return (
    <Card className="glass-card h-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="h-1 w-5 bg-primary rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
