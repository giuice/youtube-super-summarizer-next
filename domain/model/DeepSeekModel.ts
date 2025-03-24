import { BaseLanguageModel, LanguageModelConfig, SupportedModels } from "./BaseLanguageModel";
import OpenAI from "openai";

export class DeepSeekModel extends BaseLanguageModel {
  private openaiClient!: OpenAI;
  private modelName: string = "deepseek-chat";

  createModel(config: LanguageModelConfig): SupportedModels {
    this.openaiClient = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: config.apiKey,
    });
    this.modelName = config.modelName || "deepseek-chat";
    
    // Return a placeholder as we're not using LangChain's ChatDeepSeek anymore
    // This is to maintain compatibility with the BaseLanguageModel interface
    return {} as SupportedModels;
  }

  async chat(messages: { role: string; content: string; }[]): Promise<string> {
    try {
      const completion = await this.openaiClient.chat.completions.create({
        messages: messages.map(msg => ({
          role: msg.role as "system" | "user" | "assistant",
          content: msg.content
        })),
        model: this.modelName,
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error('Error in DeepSeek chat:', error);
      throw error;
    }
  }
}