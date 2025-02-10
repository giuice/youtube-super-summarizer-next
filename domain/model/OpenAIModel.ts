import { BaseLanguageModel, LanguageModelConfig } from "./BaseLanguageModel";
import { ChatOpenAI } from "@langchain/openai";

export class OpenAIModel extends BaseLanguageModel {
  createModel(config: LanguageModelConfig): ChatOpenAI {
    return new ChatOpenAI({
      modelName: config.modelName,
      temperature: config.temperature ?? 0,
      apiKey: config.apiKey,
    });
  }
}