import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons';

interface SummaryChaptersItemProps {
  summary: SummaryViewModel;
}

const SummaryItem: React.FC<SummaryChaptersItemProps> = ({ summary }) => {

 
  return (
    <div className="card mb-4 summary-item">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <FontAwesomeIcon icon={faArrowsTurnRight} size="1x" className="text-metallic" />
          </div>
          <div>
            <h4 className="mb-0 text-metallic">
             &nbsp; Minute {summary.formattedDuration} - {summary.title}
            </h4>
          </div>
        </div>
        <p className="mt-3 mb-0 summary-text">{summary.text}</p>
      </div>
    </div>
  );
};

export default SummaryItem;