import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface VideoModalProps {
  show: boolean;
  onHide: () => void;
  videoId: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ show, onHide, videoId }) => {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Video</DialogTitle>
        </DialogHeader>
        {videoId && (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="Embedded Video"
          ></iframe>
        )}
      </DialogContent>
    </Dialog>
  );
};
