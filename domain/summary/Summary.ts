import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseLanguageModel, SupportedModels, LanguageModelConfig } from "@/domain/model/BaseLanguageModel";
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
  private model: SupportedModels;

  constructor(
    modelFactory: BaseLanguageModel,
    config: LanguageModelConfig
  ) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 20,
    });
    this.model = modelFactory.createModel(config);
  }
  // constructor(openAIApiKey: string, summaryModel: string = "gpt-4o-mini") {
  //   this.splitter = new RecursiveCharacterTextSplitter({
  //     chunkSize: 400,
  //     chunkOverlap: 20,
  //   });
  //   this.model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0, apiKey: openAIApiKey });
  //   //this.summarizationChain = loadSummarizationChain(model, { type: "map_reduce" });
  // }

  

  async summarizeTranscript(
    transcript: SummaryViewModel
  ): Promise<SummaryViewModel[]> {
    const output = await this.splitter.createDocuments([transcript.text]);

    const mapTemplate = `Could you please provide a concise and comprehensive summary of the given text? The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long.:
	  

		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT:`;
    const combineMapPrompt = new PromptTemplate({
      template: mapTemplate,
      inputVariables: ["text"],
    });
    const template = `Could you please provide a concise and comprehensive summary of the given text? The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long.:
	  

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
    const mapTemplate = `Could you please provide a concise and comprehensive summary of the given text? The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long.:
		  Title: ${chapter.title}
	  
		  ###{text}###
	  
	  
		  IMPORTANT!!!: WRITE IN SAME LANGUAGE OF THE ORIGINAL TEXT::`;
    const combineMapPrompt = new PromptTemplate({
      template: mapTemplate,
      inputVariables: ["text"],
    });
    const template = `Could you please provide a concise and comprehensive summary of the given text? The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long.:
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
