// SummaryList.tsx
import React from 'react';
import { SummaryType } from '@/types/Summary';
import SummaryItem from '@/components/SummaryItem';

interface SummaryListProps {
  summaryData: SummaryType[];
}

const SummaryList: React.FC<SummaryListProps> = ({ summaryData }) => {
  let accumulatedDuration = 0;

  const formatDuration = (duration: number): string => {
	const minutes = Math.floor(duration / 60000);
	const seconds = ((duration % 60000) / 1000).toFixed(0);
	return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
	};

  const totalDuration = summaryData.reduce((total, segment) => total + segment.duration, 0);

  return (
    <div>
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
