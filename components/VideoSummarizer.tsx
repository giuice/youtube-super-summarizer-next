import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";
import { Transcript } from '@/types/Transcript';
import TranscriptItem from './TranscriptItem';
import { TranscriptResponse } from 'youtube-transcript';
import CONFIG from '@/utils/config';
import ApiError from '@/utils/ApiError';
import { Spinner } from 'reactstrap';

interface VideoSummarizerProps {
	videoId: string;
	loading: boolean;
}

const model = new OpenAI({ openAIApiKey: CONFIG.OPENAI_API_KEY, temperature: 0.1 });

export const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ videoId, loading }) => {
	//const [summaries, setSummary] = useState<Transcript[]>([]);
	const [summaries, setSummaries] = useState<Transcript[]>([]);
	const [apiError, setApiError] = useState<string>('');

	useEffect(() => {
		console.log('entrou useEffect')
		const fetchTranscript = async () => {
			try {
				const response = await axios.get(`/api/transcript?videoId=${videoId}`);
				
				if (response.status !== 200) {
					throw new ApiError(response.status, 'Failed to fetch transcript');
				}

				const transcript = response.data;
				await summarizeTranscript(transcript);
			} catch (error) {
				if (error instanceof ApiError) {
					setApiError(`API Error (${error.status}): ${error.message}`);
				} else {
					setApiError('Error fetching transcript');
				}
			}
		};

		fetchTranscript();
	}, [videoId]);


	const extractTextEvery5Minutes = async (transcript: TranscriptResponse[]): Promise<Transcript[]> => {
		const results: Transcript[] = [];

		let currentIntervalStart = 0;
		let currentIntervalText = '';

		transcript.forEach((item) => {
			const currentMinute = Math.floor(item.offset / 60000);

			if (currentMinute >= currentIntervalStart + 5) {
				results.push({
					text: currentIntervalText.trim(),
					minuteStarting: currentIntervalStart,
				});

				currentIntervalStart += 5;
				currentIntervalText = '';
			}

			currentIntervalText += ' ' + item.text;
		});

		// Add the last interval if there's any remaining text
		if (currentIntervalText.trim()) {
			results.push({
				text: currentIntervalText.trim(),
				minuteStarting: currentIntervalStart,
			});
		}

		return results;
	};


	const doSummarize = async (transcript: Transcript[]) => {
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
			const summarizedTranscriptObj: Transcript = {
				text: res.text,
				minuteStarting: t.minuteStarting,
			};

			setSummaries((prevSummaries) => [...prevSummaries, summarizedTranscriptObj]);
		}
	};


	const summarizeTranscript = async (transcript: TranscriptResponse[]) => {
		const extractedTextWithMinutes = await extractTextEvery5Minutes(transcript);
		console.log('extracted', extractedTextWithMinutes);
		await doSummarize(extractedTextWithMinutes);
	};

	return (
		<div className="container">
			{loading && (
				<div className="text-center">
					<Spinner color="primary" />
				</div>
			)}
			{apiError && <div className="alert alert-danger">{apiError}</div>}
			{summaries.map((transcript, index) => (
				<TranscriptItem key={index} transcript={transcript} />
			))}
		</div>
	);
};
