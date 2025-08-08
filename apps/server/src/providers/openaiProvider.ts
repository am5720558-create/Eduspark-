import OpenAI from "openai";
import { ChatMessage, ChatResponseChunk, ChatSettings } from "../types.js";

export class OpenAIProvider {
  private client: OpenAI;
  constructor(apiKey: string) { this.client = new OpenAI({ apiKey }); }

  async streamChat(messages: ChatMessage[], settings: Partial<ChatSettings> = {}): Promise<AsyncGenerator<ChatResponseChunk, void, unknown>> {
    const systemMessage = settings.systemPrompt ? [{ role: "system" as const, content: settings.systemPrompt }] : [];
    const mapped = [...systemMessage, ...messages].map((m) => ({ role: m.role as any, content: m.content }));
    const response = await this.client.chat.completions.create({ model: settings.model || "gpt-4o-mini", temperature: settings.temperature ?? 0.7, max_tokens: settings.maxTokens, messages: mapped as any, stream: true });

    async function* generator(): AsyncGenerator<ChatResponseChunk, void, unknown> {
      try {
        for await (const part of response as any) {
          const content = part.choices?.[0]?.delta?.content;
          if (content) { yield { type: "delta", delta: content } as ChatResponseChunk; }
        }
        yield { type: "done" } as ChatResponseChunk;
      } catch (err: any) {
        const msg: ChatResponseChunk = { type: "error", error: err?.message || "Unknown error" } as ChatResponseChunk;
        yield msg;
      }
      return;
    }
    return generator();
  }
}
