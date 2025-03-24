import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SummaryItemProps {
  summary: SummaryViewModel;
  accumulatedDuration: string;
  progressBarWidth: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ summary,accumulatedDuration,  progressBarWidth }) => {

  
  return (
    <div className="card mb-4 summary-item">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <FontAwesomeIcon icon={faClock} size="2x" className="text-metallic" />
          </div>
          <div>
            <h4 className="mb-0 text-metallic">
              &nbsp; Minute {summary.minuteStarting} - {accumulatedDuration}
            </h4>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                title="Progress"
                style={{ width: `${progressBarWidth}%` }}
                aria-valuenow={progressBarWidth}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>
         {/* Use ReactMarkdown to render markdown as HTML */}
         <ReactMarkdown remarkPlugins={[remarkGfm]} className="mt-3 mb-0 summary-text">
           {summary.text} 
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryItem;