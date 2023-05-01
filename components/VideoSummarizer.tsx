import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";
import { SummaryViewModel } from '@/domain/summary/Summary';
import { TranscriptResponse } from 'youtube-transcript';
import ApiError from '@/utils/ApiError';
import { Spinner } from 'reactstrap';
import SummaryList from './SummaryList';
import {Summary} from '@/domain/summary/Summary';
import SummaryService from '@/domain/summary/SummaryService';
import SummaryRepositorySupabase from '@/infra/supabase/SummaryRepositorySupabase';
import getVideoData from '@/application/getVideoData';
import SummaryChaptersList from './SummaryChaptersList';

process.env.LANGCHAIN_TRACING = "true";
interface VideoSummarizerProps {
	videoId: string;
	useChapters: boolean;
	selectedModel: string;
	onVideoSummarized: () => void;//to update last videos summarizeds list
}

const model = new OpenAI({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, temperature: 0.1 });

export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ videoId,  useChapters, selectedModel,  onVideoSummarized }) => {
	//const [summaries, setSummary] = useState<Transcript[]>([]);
	const [summaries, setSummaries] = useState<SummaryViewModel[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [hasChapters, setHasChapters] = useState(false);
	
	useEffect(() => {

		
		const doSummarizeTranscript = async (transcript: SummaryViewModel[]) => {
			const summarizer = new Summary(model);
			const summaries = await summarizer.summarizeTranscript(transcript);
			summaries.forEach((summarizedTranscriptObj) => {
			  setSummaries((prevSummaries) => [...prevSummaries, summarizedTranscriptObj]);
			});
			await summarizer.saveSummaries(summaries, model);
			onVideoSummarized();
		  };

		  const doSummarizeChapters = async (chapters: SummaryViewModel[]) => {
			const summarizer = new Summary(model);
			const summaries = await summarizer.summarizeChapter(chapters);
			summaries.forEach((summarizedTranscriptObj) => {
			  setSummaries((prevSummaries) => [...prevSummaries, summarizedTranscriptObj]);
			});
			await summarizer.saveSummaries(summaries, model);
			onVideoSummarized();
		  };


		const fetchTranscript = async () => {
			try {
				const transDto = await getVideoData.getVideoTranscripts(videoId);
				if(transDto.chapters && useChapters){
					setHasChapters(true);
					await doSummarizeChapters(transDto.chapters);
				}
				else{
					setHasChapters(false);
					await doSummarizeTranscript(transDto.transcripts);
				}
				// if (!await getSummaries()) {
				// 	let transcript: TranscriptResponse[] = [];
				// 	//const tService: TranscriptService = new VideoSegment(new VideoSegmentRepositorySupabase());

				// 	//const tData = await tService.findByVideoId(videoId);
				// 	const tData = null;
				// 	if (!tData) {
				// 		const response = await axios.get(`/api/transcript?videoId=${videoId}`);

				// 		if (response.status !== 200) {
				// 			throw new ApiError(response.status, 'Failed to fetch transcript');
				// 		}
				// 		transcript = response.data;
				// 		console.log('vai criar transcript')
				// 		//await tService.create({ video_id: videoId, json_text: transcript, created_at: new Date() });
				// 		console.log('tentou criar transcript')

				// 	} else {
				// 		//transcript = tData.json_text as TranscriptResponse[];
				// 	}
				// 	const videoData = await GetVideoData.getVideoMetadata(videoId);
				// 	const transcript2: TranscriptEntry[] = await GetVideoData.getVideoTranscript(videoId);
				// 	var video = new Video(videoId, videoData, new VideoRepositorySupabase());
				// 	//await createVideoMetadata(); //save the video metadata
				// 	//await summarizeTranscript(transcript);
				// }
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
	}, [videoId, useChapters, selectedModel, onVideoSummarized]);


	const getSummaries = async (): Promise<boolean> => {
		const sService: SummaryService = new SummaryService(new SummaryRepositorySupabase());
		const sData = await sService.findByVideoId(videoId);
		if (sData) {
			//setSummaries(sData.json_text as SummaryViewModel[]);
			return true;
		}
		return false;
	}

	
// 	const myprompt =
//   PromptTemplate.fromTemplate(`TLDR; The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage`);



	return (
		<div className="container">
			{loading && (
				<div className="text-center">
					{/* Add an encouraging phrase */}
					<h3 className="text-header mb-3">Your video is summarizing...</h3>
					{/* Change the color of the Spinner */}
					<Spinner style={{ borderColor: '#c4302b', borderWidth: '0.2em' }} />
				</div>
			)}
			{apiError && <div className="alert alert-danger">{apiError}</div>}
		{(!useChapters && !hasChapters) &&<SummaryList summaryData={summaries} /> }
		{(useChapters && hasChapters) && <SummaryChaptersList summaryData={summaries} />}
			{/* {summaries.map((transcript, index) => (
								
				<SummaryItem key={index} summary={transcript} totalDuration={summaries.reduce((total, segment) => total + segment.duration, 0)} />
			))} */}
		</div>
	);
};
