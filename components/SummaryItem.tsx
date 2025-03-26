import React from 'react';
import { SummaryViewModel } from '@/domain/summary/Summary';
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";

interface SummaryItemProps {
  summary: SummaryViewModel;
  accumulatedDuration: string;
  progressBarWidth: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ summary, accumulatedDuration, progressBarWidth }) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            <FontAwesomeIcon icon={faClock} size="2x" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2 text-foreground">
              Minute {summary.minuteStarting} - {accumulatedDuration}
            </h4>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-error transition-all",
                  progressBarWidth > 90 ? "rounded-l-full" : "rounded-full"
                )}
                role="progressbar"
                style={{ width: `${progressBarWidth}%` }}
                aria-valuenow={progressBarWidth}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 prose dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
        >
          {summary.text}
        </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryItem;