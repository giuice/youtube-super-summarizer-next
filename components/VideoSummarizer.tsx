import React, { useEffect, useState } from 'react';
import { Summaries, SummaryViewModel } from '@/domain/summary/Summary';
import ApiError from '@/utils/ApiError';
import { Spinner } from 'reactstrap';
import SummaryList from './SummaryList';
import { Summary } from '@/domain/summary/Summary';
import VideoDataService from '@/application/VideoDataService';
import SummaryChaptersList from './SummaryChaptersList';
import { OpenAIModel } from '@/domain/model/OpenAIModel';
import { DeepSeekModel } from '@/domain/model/DeepSeekModel';
import { BaseLanguageModel } from '@/domain/model/BaseLanguageModel';
import { ChatPopup } from './ChatPopup';

// process.env.LANGCHAIN_TRACING = "true";
interface VideoSummarizerProps {
	videoId: string;
	useChapters: boolean;
	selectedModel: string;
	onVideoTitleUpdate: (title: string) => void;
	onVideoSummarized: () => void;
	apiKey: string;//to update last videos summarizeds list
}



export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ videoId, useChapters, selectedModel, onVideoTitleUpdate, onVideoSummarized, apiKey }) => {
	//const [summaries, setSummary] = useState<Transcript[]>([]);
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
		<div className="container relative">
			{loading && (
				<div className="text-center">
					{/* Add an encouraging phrase */}
					<h3 className="text-header mb-3">Your video is summarizing...</h3>
					{/* Change the color of the Spinner */}
					<Spinner style={{ borderColor: '#c4302b', borderWidth: '0.2em' }} />
				</div>
			)}
			{apiError && <div className="alert alert-danger">{apiError}</div>}
			
			{!loading && !apiError && (
				<div className="mb-4">
					<button
						onClick={() => setShowChat(true)}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Chat with Video Content
					</button>
				</div>
			)}
			
			{!hasChapters && summaries && <SummaryList summaryData={summaries} />}
			{useChapters && hasChapters && <SummaryChaptersList summaryData={summaries} />}
			
			<ChatPopup
				show={showChat}
				onClose={() => setShowChat(false)}
				videoId={videoId}
			/>
		</div>
	);
};
