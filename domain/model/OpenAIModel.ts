import { BaseLanguageModel, LanguageModelConfig } from "./BaseLanguageModel";
import { ChatOpenAI } from "@langchain/openai";
import { MessageContent, MessageContentText } from "@langchain/core/messages";

export class OpenAIModel extends BaseLanguageModel {
  private model!: ChatOpenAI; // Definite assignment assertion

  createModel(config: LanguageModelConfig): ChatOpenAI {
    this.model = new ChatOpenAI({
      modelName: config.modelName,
      temperature: config.temperature ?? 0,
      apiKey: config.apiKey,
    });
    return this.model;
  }

  async chat(messages: { role: string; content: string; }[]): Promise<string> {
    try {
      const response = await this.model.invoke(messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      })));

      // Handle both string and complex message content
      if (typeof response.content === 'string') {
        return response.content;
      }

      // For complex content, extract text content
      const contentArray = Array.isArray(response.content) ? response.content : [response.content];
      return contentArray
        .filter((content): content is MessageContentText => 
          typeof content === 'object' && 'type' in content && content.type === 'text')
        .map(content => content.text)
        .join(' ');
    } catch (error) {
      console.error('Error in OpenAI chat:', error);
      throw error;
    }
  }
}
