import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ISummaryRepository } from "./ISummaryRepository";
import SummaryService from "./SummaryService";
import { loadSummarizationChain } from "langchain/chains";
import SummaryRepositorySupabase from "@/infra/supabase/SummaryRepositorySupabase";
import {PromptTemplate} from "langchain/prompts";

export interface SummaryViewModel {
	text: string;
	minuteStarting: number;
	duration: number;
	formattedDuration: string;
	title?: string;
}

export interface Summaries {
	transcripts: SummaryViewModel[];
	chapters: SummaryViewModel[] | null;
}

interface ISummary{
	
}


export class Summary {
	private splitter: RecursiveCharacterTextSplitter;
	private summarizationChain: any;
	private summaryService: SummaryService;
    private model: any;
	constructor(model: any) {
	  this.splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 400,
		chunkOverlap: 20,
	  });
	  this.model = model;
	  //this.summarizationChain = loadSummarizationChain(model, { type: "map_reduce" });
	  this.summaryService = new SummaryService(new SummaryRepositorySupabase());
	}
  
	async summarizeTranscript(transcript: SummaryViewModel[]): Promise<SummaryViewModel[]> {
	  let summaries: SummaryViewModel[] = [];
	  for (const t of transcript) {
		const output = await this.splitter.createDocuments([t.text]);
		const res = await this.summarizationChain.call({
		  input_documents: output,
		});
		const summarizedTranscriptObj: SummaryViewModel = {
		  text: res.text,
		  minuteStarting: t.minuteStarting,
		  duration: t.duration,
		  formattedDuration: t.formattedDuration,
		};
		summaries.push(summarizedTranscriptObj);
	  }
	  return summaries;
	}

	async summarizeChapter(chapters: SummaryViewModel[]): Promise<SummaryViewModel[]> {
		let summaries: SummaryViewModel[] = [];
		for (const t of chapters) {
		  const output = await this.splitter.createDocuments([t.text]);
		//   const template = `Write a concise summary of the following text:
		// 	Title: ${t.title}

		// 	"{text}"


		// 	CONCISE SUMMARY:`
		// 	const myPrompt = new PromptTemplate({
		// 	template,
		// 	inputVariables: ["text"],
		// 	})
		  const res = await loadSummarizationChain(this.model, { type: "map_reduce", }).call({
			input_documents: output
		  });
		  const summarizedTranscriptObj: SummaryViewModel = {
			text: res.text,
			minuteStarting: t.minuteStarting,
			duration: t.duration,
			formattedDuration: t.formattedDuration,
			title: t.title
		  };
		  summaries.push(summarizedTranscriptObj);
		}
		return summaries;
	  }
  
	async saveSummaries(summaries: SummaryViewModel[], model: any) {
	  //await this.summaryService.create({ json_text: summaries, model: model.modelName, created_at: new Date() });
	}
  }