import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import SummaryService from "./SummaryService";
import { loadSummarizationChain } from "langchain/chains";
import { ISummaryRepository } from "./ISummaryRepository";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";

export interface SummaryViewModel {
  text: string;
  minuteStarting: number;
  duration: number;
  formattedDuration: string;
  title?: string;
}

export interface Summaries {
  transcripts: SummaryViewModel[] |null;
  chapters: SummaryViewModel[] | null;
}

interface ISummary {}

export class Summary {
  private splitter: RecursiveCharacterTextSplitter;
  private model: OpenAI;


  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 20,
    });
    this.model = new OpenAI({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      temperature: 0.1,
    });
    //this.summarizationChain = loadSummarizationChain(model, { type: "map_reduce" });
  }

  async summarizeTranscript2(
    transcript: SummaryViewModel[]
  ): Promise<SummaryViewModel[]> {
    let summaries: SummaryViewModel[] = [];
    try {
      for (const t of transcript) {
        const output = await this.splitter.createDocuments([t.text]);

        //   const template = `TLDR; the following text,  The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:

        // 	"{text}"

        // 	CONCISE SUMMARY:`
        // 	const myPrompt = new PromptTemplate({
        // 	template,
        // 	inputVariables: ["text"],
        // 	})
        const res = await loadSummarizationChain(this.model, {
          type: "stuff",
        }).call({
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
    } catch (error) {
      console.log(error);
    }

    return summaries;
  }

  async summarizeChapter2(
    chapters: SummaryViewModel[]
  ): Promise<SummaryViewModel[]> {
    let summaries: SummaryViewModel[] = [];
    for (const t of chapters) {
      const output = await this.splitter.createDocuments([t.text]);
      const template = `TLDR; the following text,  The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
			Title: ${t.title}

			"{text}"


			CONCISE SUMMARY:`;
      const myPrompt = new PromptTemplate({
        template,
        inputVariables: ["text"],
      });
      const res = await loadSummarizationChain(this.model, {
        type: "map_reduce",
        combineMapPrompt: myPrompt,
      }).call({
        input_documents: output,
      });
      const summarizedTranscriptObj: SummaryViewModel = {
        text: res.text,
        minuteStarting: t.minuteStarting,
        duration: t.duration,
        formattedDuration: t.formattedDuration,
        title: t.title,
      };
      summaries.push(summarizedTranscriptObj);
    }
    return summaries;
  }

  async summarizeTranscript(
    transcript: SummaryViewModel
  ): Promise<SummaryViewModel[]> {
    const output = await this.splitter.createDocuments([transcript.text]);

    //   const template = `TLDR; the following text,  The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:

    // 	"{text}"

    // 	CONCISE SUMMARY:`
    // 	const myPrompt = new PromptTemplate({
    // 	template,
    // 	inputVariables: ["text"],
    // 	})
    const res = await loadSummarizationChain(this.model, {
      type: "stuff",
    }).call({
      input_documents: output,
    });
    const summarizedTranscriptObj: SummaryViewModel = {
      text: res.text,
      minuteStarting: transcript.minuteStarting,
      duration: transcript.duration,
      formattedDuration: transcript.formattedDuration,
    };

    return [summarizedTranscriptObj];
  }

  async summarizeChapter(
    chapter: SummaryViewModel
  ): Promise<SummaryViewModel[]> {
    const output = await this.splitter.createDocuments([chapter.text]);
    const template = `TLDR; the following text,  The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
		  Title: ${chapter.title}
	  
		  "{text}"
	  
	  
		  CONCISE SUMMARY:`;
    const myPrompt = new PromptTemplate({
      template,
      inputVariables: ["text"],
    });
    const res = await loadSummarizationChain(this.model, {
      type: "map_reduce",
      combineMapPrompt: myPrompt,
    }).call({
      input_documents: output,
    });
    const summarizedTranscriptObj: SummaryViewModel = {
      text: res.text,
      minuteStarting: chapter.minuteStarting,
      duration: chapter.duration,
      formattedDuration: chapter.formattedDuration,
      title: chapter.title,
    };

    return [summarizedTranscriptObj];
  }

  async saveSummaries(summaries: SummaryViewModel[]) {
    //await this.summaryService.create({ json_text: summaries, model: model.modelName, created_at: new Date() });
  }
}
