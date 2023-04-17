import React from 'react';
import { Transcript } from '@/types/Transcript';

interface TranscriptItemProps {
  transcript: Transcript;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({ transcript }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="card-title">Minute {transcript.minuteStarting}:</h2>
        <p className="card-text">{transcript.text}</p>
      </div>
    </div>
  );
};

export default TranscriptItem;