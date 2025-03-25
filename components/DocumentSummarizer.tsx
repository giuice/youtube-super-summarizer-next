// components/DocumentSummarizer.tsx
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OpenAIModel } from '@/domain/model/OpenAIModel';
import { DeepSeekModel } from '@/domain/model/DeepSeekModel';
import { BaseLanguageModel } from '@/domain/model/BaseLanguageModel';
import { Summary } from '@/domain/summary/Summary';
import { SummaryViewModel } from '@/domain/summary/Summary';
import SummaryList from './SummaryList';

interface DocumentSummarizerProps {
  selectedModel: string;
  apiKey: string;
}

export const DocumentTab: React.FC<DocumentSummarizerProps> = ({ selectedModel, apiKey }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [summaries, setSummaries] = useState<SummaryViewModel[]>([]);

  const getModelFactory = (model: string): BaseLanguageModel => {
    switch (model) {
      case 'deepseek-reasoner':
        return new DeepSeekModel();
      default:
        return new OpenAIModel();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    try {
      const text = await file.text();
      setText(text);
    } catch (err) {
      setError('Error reading file');
    }
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter or upload some text to summarize');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const modelFactory = getModelFactory(selectedModel);
      const summarizer = new Summary(modelFactory, {
        apiKey,
        modelName: selectedModel,
        temperature: 0
      });

      // Create a summary view model from the text
      const documentViewModel: SummaryViewModel = {
        text,
        duration: 0,
        minuteStarting: 0,
        formattedDuration: '',
        title: file ? file.name : 'Document Summary'
      };

      const summarizedContent = await summarizer.summarizeChapter(documentViewModel);
      setSummaries(summarizedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="file-upload">
              Upload a document
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.md,.doc,.docx"
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="text-input">
              Or paste your text here
            </label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Enter text to summarize..."
              className="min-h-[200px]"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <Button
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            ) : (
              'Summarize'
            )}
          </Button>
        </CardContent>
      </Card>

      {summaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <SummaryList summaryData={summaries} />
        </div>
      )}
    </div>
  );
};

export default DocumentTab;
