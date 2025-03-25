import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SummaryChaptersItemProps {
  summary: SummaryViewModel;
}

const SummaryItem: React.FC<SummaryChaptersItemProps> = ({ summary }) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            <FontAwesomeIcon icon={faArrowsTurnRight} size="1x" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">
              {summary.formattedDuration} - {summary.title}
            </h4>
          </div>
        </div>
        <div className="mt-3 prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summary.text}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryItem;