import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";
import { SummaryType } from '@/types/Summary';
import { TranscriptResponse } from 'youtube-transcript';
import ApiError from '@/utils/ApiError';
import { Spinner } from 'reactstrap';
import SummaryList from './SummaryList';
import TranscriptRepositorySupabase from '@/infra/supabase/TranscriptRepositorySupabase';
import TranscriptService from '@/infra/services/TranscriptService';
import SummaryService from '@/infra/services/SummaryService';
import SummaryRepositorySupabase from '@/infra/supabase/SummaryRepositorySupabase';
import createVideoMetadata from '@/domain/video/getVideoMetadata';

interface VideoSummarizerProps {
	videoId: string;
	onVideoSummarized: () => void;//to update last videos summarizeds list
}

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.1 });

export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ videoId, onVideoSummarized }) => {
	//const [summaries, setSummary] = useState<Transcript[]>([]);
	const [summaries, setSummaries] = useState<SummaryType[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		console.log('entrou useEffect')
		const fetchTranscript = async () => {
			try {

				if (!await getSummaries()) {
					let transcript: TranscriptResponse[] = [];
					const tService: TranscriptService = new TranscriptService(new TranscriptRepositorySupabase());

					const tData = await tService.findByVideoId(videoId);

					if (!tData) {
						const response = await axios.get(`/api/transcript?videoId=${videoId}`);

						if (response.status !== 200) {
							throw new ApiError(response.status, 'Failed to fetch transcript');
						}
						transcript = response.data;
						console.log('vai criar transcript')
						await tService.create({ video_id: videoId, json_text: transcript, created_at: new Date() });
						console.log('tentou criar transcript')

					} else {
						transcript = tData.json_text as TranscriptResponse[];
					}
					await createVideoMetadata(videoId); //save the video metadata
					await summarizeTranscript(transcript);
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


	const getSummaries = async (): Promise<boolean> => {
		const sService: SummaryService = new SummaryService(new SummaryRepositorySupabase());
		const sData = await sService.findByVideoId(videoId);
		if (sData) {
			setSummaries(sData.json_text as SummaryType[]);
			return true;
		}
		return false;
	}

	const formatDuration = (duration: number): string => {
		const minutes = Math.floor(duration / 60000);
		const seconds = ((duration % 60000) / 1000).toFixed(0);
		return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
	};

	function segmentTranscriptByDuration({ transcript }: { transcript: TranscriptResponse[]; }): SummaryType[] {
		const segmentDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
		const initialAccumulator = {
			results: [] as SummaryType[],
			currentIntervalStart: 0,
			currentIntervalText: '',
			currentDuration: 0,
		};

		const finalAccumulator = transcript.reduce((accumulator, item) => {
			while (item.offset >= accumulator.currentIntervalStart + segmentDuration) {
				accumulator.results.push({
					text: accumulator.currentIntervalText.trim(),
					minuteStarting: accumulator.currentIntervalStart / 60000,
					duration: segmentDuration,
					formattedDuration: formatDuration(segmentDuration),
				});

				accumulator.currentIntervalStart += segmentDuration;
				accumulator.currentIntervalText = '';
				accumulator.currentDuration = 0;
			}

			accumulator.currentIntervalText += ' ' + item.text;
			accumulator.currentDuration += item.duration;

			return accumulator;
		}, initialAccumulator);

		// Add the last interval if there's any remaining text
		if (finalAccumulator.currentIntervalText.trim()) {
			finalAccumulator.results.push({
				text: finalAccumulator.currentIntervalText.trim(),
				minuteStarting: finalAccumulator.currentIntervalStart / 60000,
				duration: finalAccumulator.currentDuration,
				formattedDuration: formatDuration(finalAccumulator.currentDuration),
			});
		}
		console.log('final results', finalAccumulator.results)
		console.log('reduce duration', finalAccumulator.results.reduce((total, segment) => total + segment.duration, 0));
		//return [];
		return finalAccumulator.results;
	}

// 	const myprompt =
//   PromptTemplate.fromTemplate(`TLDR; The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage`);



	const doSummarize = async (transcript: SummaryType[]) => {
		const splitter = new RecursiveCharacterTextSplitter({
			//separator: " ",
			chunkSize: 400,
			chunkOverlap: 20,
		});
		
		
		let summaries : SummaryType[] = [];
		for (const t of transcript) {
			const output = await splitter.createDocuments([t.text]);
			const chain = loadSummarizationChain(model, { type: "map_reduce" });
			const res = await chain.call({
				input_documents: output, 
			});
			const summarizedTranscriptObj: SummaryType = {
				text: res.text,
				minuteStarting: t.minuteStarting,
				duration: t.duration,
				formattedDuration: t.formattedDuration,
			};
			summaries.push(summarizedTranscriptObj);
			setSummaries((prevSummaries) => [...prevSummaries, summarizedTranscriptObj]);

		}
		
		const sService: SummaryService = new SummaryService(new SummaryRepositorySupabase());
		await sService.create({ video_id: videoId, json_text: summaries, model:model.modelName, created_at: new Date() });
		onVideoSummarized();

	};


	const summarizeTranscript = async (transcript: TranscriptResponse[]) => {
		const extractedTextWithMinutes = await segmentTranscriptByDuration({ transcript });

		await doSummarize(extractedTextWithMinutes);
	};
   

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
			<SummaryList summaryData={summaries} />
			{/* {summaries.map((transcript, index) => (
								
				<SummaryItem key={index} summary={transcript} totalDuration={summaries.reduce((total, segment) => total + segment.duration, 0)} />
			))} */}
		</div>
	);
};
