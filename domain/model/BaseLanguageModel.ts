import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";

export type SupportedModels = ChatOpenAI | ChatDeepSeek;

export interface LanguageModelConfig {
  apiKey: string;
  modelName: string;
  temperature?: number;
}

export abstract class BaseLanguageModel {
  abstract createModel(config: LanguageModelConfig): SupportedModels;
}