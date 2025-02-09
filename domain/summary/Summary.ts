import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PromptTemplate } from "@langchain/core/prompts";

import { loadSummarizationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";

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
  private model: ChatOpenAI;


  constructor(openAIApiKey: string, summaryModel: string = "gpt-4o-mini") {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 20,
    });
    this.model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0, apiKey: openAIApiKey });
    //this.summarizationChain = loadSummarizationChain(model, { type: "map_reduce" });
  }

  

  async summarizeTranscript(
    transcript: SummaryViewModel
  ): Promise<SummaryViewModel[]> {
    const output = await this.splitter.createDocuments([transcript.text]);

    const mapTemplate = `TLDR; the text delimited by triple Hashes, The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
	  

		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT:`;
    const combineMapPrompt = new PromptTemplate({
      template: mapTemplate,
      inputVariables: ["text"],
    });
    const template = `TLDR; the text delimited by triple Hashes, The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
	  

		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT::`;
    const combinePrompt = new PromptTemplate({
      template,
      inputVariables: ["text"],
    });
    // const res = await loadSummarizationChain(this.model, {
    //   type: "map_reduce",
    //   combineMapPrompt:combineMapPrompt,
    //   combinePrompt: combinePrompt,
    // }).call({
    //   input_documents: output,
    // });
    const res = await loadSummarizationChain(this.model, {
      type: "stuff",
      prompt: combinePrompt,
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
    const mapTemplate = `TLDR; the text delimited by triple Hashes, The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
		  Title: ${chapter.title}
	  
		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT::`;
    const combineMapPrompt = new PromptTemplate({
      template: mapTemplate,
      inputVariables: ["text"],
    });
    const template = `TLDR; the text delimited by triple Hashes, The focus should be on identifying and analyzing the strategies the author uses to make their point, rather than summarizing the passage:
		  Title: ${chapter.title}
	  
		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT:`;
    const combinePrompt = new PromptTemplate({
      template,
      inputVariables: ["text"],
    });
    // const res = await loadSummarizationChain(this.model, {
    //   type: "map_reduce",
    //   combineMapPrompt: combineMapPrompt,
    //   combinePrompt: combinePrompt

    // }).call({
    //   input_documents: output,
    // });
    const res = await loadSummarizationChain(this.model, {
      type: "stuff",
      prompt: combinePrompt,
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
