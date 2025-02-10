import { BaseLanguageModel, LanguageModelConfig } from "./BaseLanguageModel";
import { ChatDeepSeek } from "@langchain/deepseek";

export class DeepSeekModel extends BaseLanguageModel {
  createModel(config: LanguageModelConfig): ChatDeepSeek {
    return new ChatDeepSeek({
      modelName: config.modelName,
      temperature: config.temperature ?? 0,
      apiKey: config.apiKey,
    });
  }
}