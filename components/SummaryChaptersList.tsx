// SummaryList.tsx
import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';
import SummaryChaptersItem from '@/components/SummaryChaptersItem';

interface SummaryListProps {
  summaryData: SummaryViewModel[];
}

const SummaryList: React.FC<SummaryListProps> = ({ summaryData }) => {
  return (
    <div className="space-y-4">
      {summaryData.map((item, index) => (
        <SummaryChaptersItem
          key={index}
          summary={item}
        />
      ))}
    </div>
  );
};

export default SummaryList;
