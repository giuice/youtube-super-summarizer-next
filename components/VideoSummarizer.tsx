import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";
import { Summary } from '@/types/Summary';
import SummaryItem from '@/components/SummaryItem';
import { TranscriptResponse } from 'youtube-transcript';
import CONFIG from '@/utils/config';
import ApiError from '@/utils/ApiError';
import { Spinner } from 'reactstrap';
import { getTranscript } from '@/utils/mongoDb';
import SummaryList from './SummaryList';


interface VideoSummarizerProps {
	videoId: string;
}

const model = new OpenAI({ openAIApiKey: CONFIG.OPENAI_API_KEY, temperature: 0.1 });

export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ videoId }) => {
	//const [summaries, setSummary] = useState<Transcript[]>([]);
	const [summaries, setSummaries] = useState<Summary[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const [loading, setLoading] = useState(true);
	let totalDuration: number =0;

	useEffect(() => {
		console.log('entrou useEffect')
		const fetchTranscript = async () => {
			try {

				const response = await axios.get(`/api/transcript?videoId=${videoId}`);

				if (response.status !== 200) {
					throw new ApiError(response.status, 'Failed to fetch transcript');
				}

				const transcript = response.data;
				console.log(transcript);
				await summarizeTranscript(transcript);
				setLoading(false);
			} catch (error) {
				if (error instanceof ApiError) {
					setApiError(`API Error (${error.status}): ${error.message}`);
				} else {
					setApiError('Error fetching transcript');
				}

				setLoading(false);
			}
		};

		fetchTranscript();
	}, [videoId]);


	const formatDuration = (duration: number): string => {
		const minutes = Math.floor(duration / 60000);
		const seconds = ((duration % 60000) / 1000).toFixed(0);
		return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
	};

	function segmentTranscriptByDuration({ transcript }: { transcript: TranscriptResponse[]; }): Summary[] {
		const segmentDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
		const initialAccumulator = {
		  results: [] as Summary[],
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
		console.log('final results',finalAccumulator.results)
		console.log('reduce duration', finalAccumulator.results.reduce((total, segment) => total + segment.duration, 0));
		//return [];
		return finalAccumulator.results;
	  }
	  
	  


	const doSummarize = async (transcript: Summary[]) => {
		const splitter = new RecursiveCharacterTextSplitter({
			//separator: " ",
			chunkSize: 400,
			chunkOverlap: 20,
		});

		for (const t of transcript) {
			const output = await splitter.createDocuments([t.text]);
			const chain = loadSummarizationChain(model, { type: "map_reduce" });
			const res = await chain.call({
				input_documents: output,
			});
			const summarizedTranscriptObj: Summary = {
				text: res.text,
				minuteStarting: t.minuteStarting,
				duration: t.duration,
				formattedDuration: t.formattedDuration,
			};

			setSummaries((prevSummaries) => [...prevSummaries, summarizedTranscriptObj]);
			
		}
	};


	const summarizeTranscript = async (transcript: TranscriptResponse[]) => {
		const extractedTextWithMinutes = await segmentTranscriptByDuration({ transcript });
		console.log('extracted', extractedTextWithMinutes);
		await doSummarize(extractedTextWithMinutes);
	};
	let accumulatedDuration = 0;

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
