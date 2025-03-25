import React, { useEffect, useState } from 'react';
import { Summaries, SummaryViewModel } from '@/domain/summary/Summary';
import ApiError from '@/utils/ApiError';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SummaryList from './SummaryList';
import { Summary } from '@/domain/summary/Summary';
import VideoDataService from '@/application/VideoDataService';
import SummaryChaptersList from './SummaryChaptersList';
import { OpenAIModel } from '@/domain/model/OpenAIModel';
import { DeepSeekModel } from '@/domain/model/DeepSeekModel';
import { BaseLanguageModel } from '@/domain/model/BaseLanguageModel';
import { ChatPopup } from './ChatPopup';

interface VideoSummarizerProps {
  videoId: string;
  useChapters: boolean;
  selectedModel: string;
  onVideoTitleUpdate: (title: string) => void;
  onVideoSummarized: () => void;
  apiKey: string;
}

export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ 
  videoId, 
  useChapters, 
  selectedModel, 
  onVideoTitleUpdate, 
  onVideoSummarized, 
  apiKey 
}) => {
  const [summaries, setSummaries] = useState<SummaryViewModel[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasChapters, setHasChapters] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const metadata = await VideoDataService.getVideoMetadata(videoId);
        if (metadata) { 
          onVideoTitleUpdate(metadata.title);
        }
        const summariesObj: Summaries | null = await VideoDataService.getSummaries(videoId);

        const transcripts = summariesObj?.transcripts;
        const chapters = summariesObj?.chapters;
        if (isVideoSummarized(summariesObj, useChapters)) {

          if (transcripts || (!chapters && useChapters)){
            console.log('has transcripts')
            if (transcripts)
            {
              setSummaries(transcripts);
              setHasChapters(false);
            }
          }      
          if (chapters && useChapters){
            console.log('has chapters')
            setSummaries(chapters);
            setHasChapters(true);
          }
            
        } else {
          const transDto = await VideoDataService.getVideoTranscripts(videoId);
          console.log('transDto', transDto);
          if (transDto.chapters && transDto.chapters.length > 0 && useChapters) {
            console.log('has chapters')
            setHasChapters(true);
            const sc = await doSummarizeChapters(transDto.chapters);

            await VideoDataService.saveSummaryChapters(videoId,
              selectedModel, sc)
            await VideoDataService.saveVideoMetadata(videoId)
              onVideoSummarized();
          }
          else {
            if (transDto.transcripts) {
              setHasChapters(false);
              const st = await doSummarizeTranscript(transDto.transcripts);
              await VideoDataService.saveSummaryTranscripts(videoId,
                selectedModel, st);
              await VideoDataService.saveVideoMetadata(videoId);
              onVideoSummarized();
                  
            }
          }

        }


        setLoading(false);
      } catch (error) {
        if (error instanceof ApiError) {
          setApiError(`API Error (${error.status}): ${error.message}`);
        } else {
          setApiError(`Error fetching transcript: ${error}`);
        }

        setLoading(false);
      }
    };

    fetchTranscript();
  }, [videoId]);

  const getModelFactory = (model: string): BaseLanguageModel => {
    switch (model) {
      case 'deepseek-reasoner':
        return new DeepSeekModel();
      default:
        return new OpenAIModel();
    }
  };

  const isVideoSummarized = (summariesObj: Summaries | null, useChapters: boolean): boolean => {
    if (useChapters) {
      return summariesObj?.chapters !== undefined;
    } else {
      return summariesObj?.transcripts !== undefined;
    }
  };


  const doSummarizeTranscript = async (transcript: SummaryViewModel[]): Promise<SummaryViewModel[]> => {
    
    const modelFactory = getModelFactory(selectedModel);
    const summarizer = new Summary(modelFactory, {
      apiKey: apiKey,
      modelName: selectedModel,
      temperature: 0
    });
    const newSummaries: SummaryViewModel[] = [];
      console.log('doSummarizeTranscript', transcript);
    for (const t of transcript) {
      const summarizedTranscriptObj = await summarizer.summarizeTranscript(t);
      newSummaries.push(...summarizedTranscriptObj);
      setSummaries((prevSummaries) => [...prevSummaries, ...summarizedTranscriptObj]);
    }
  
    return newSummaries;
    };
    
    const doSummarizeChapters = async (chapters: SummaryViewModel[]): Promise<SummaryViewModel[]> => {
    const modelFactory = getModelFactory(selectedModel);
    const summarizer = new Summary(modelFactory, {
      apiKey: apiKey,
      modelName: selectedModel,
      temperature: 0
    });
    const newSummaries: SummaryViewModel[] = [];
  
    for (const chapter of chapters) {
      const summarizedChapter = await summarizer.summarizeChapter(chapter);
      newSummaries.push(...summarizedChapter);
      setSummaries((prevSummaries) => [...prevSummaries, ...summarizedChapter]);
    }
  
    return newSummaries;
    };

  return (
    <div className="w-full space-y-6">
      {loading && (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-semibold">Your video is summarizing...</h3>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </Card>
      )}

      {apiError && (
        <Card className="p-6 border-destructive">
          <div className="text-destructive">{apiError}</div>
        </Card>
      )}
      
      {!loading && !apiError && (
        <div className="space-y-6">
          <Button
            onClick={() => setShowChat(true)}
            variant="default"
            className="w-full sm:w-auto"
          >
            Chat with Video Content
          </Button>

          {!hasChapters && <SummaryList summaryData={summaries} />}
          {useChapters && hasChapters && <SummaryChaptersList summaryData={summaries} />}
        </div>
      )}
      
      <ChatPopup
        show={showChat}
        onClose={() => setShowChat(false)}
        videoId={videoId}
      />
    </div>
  );
};
