// SummaryList.tsx
import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';
import SummaryItem from '@/components/SummaryItem';

interface SummaryListProps {
  summaryData: SummaryViewModel[];
}

const SummaryList: React.FC<SummaryListProps> = ({ summaryData }) => {
  let accumulatedDuration = 0;

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const totalDuration = summaryData.reduce((total, segment) => total + segment.duration, 0);
  
  return (
    <div className="space-y-4">
      {summaryData.map((item, index) => {
        accumulatedDuration += item.duration;
        const progressBarWidth = (accumulatedDuration / totalDuration) * 100;

        return (
          <SummaryItem
            key={index}
            summary={item}
            progressBarWidth={progressBarWidth}
            accumulatedDuration={formatDuration(accumulatedDuration)}
          />
        );
      })}
    </div>
  );
};

export default SummaryList;
