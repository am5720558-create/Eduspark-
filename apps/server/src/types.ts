export type ChatRole = "system" | "user" | "assistant" | "tool";
export interface ChatMessage { id?: string; role: ChatRole; content: string; }
export interface ChatSettings { model: string; temperature?: number; maxTokens?: number; presencePenalty?: number; frequencyPenalty?: number; topP?: number; systemPrompt?: string; locale?: string; tone?: string; }
export interface ChatResponseChunk { type: "delta" | "done" | "error"; delta?: string; conversationId?: string; usage?: { promptTokens: number; completionTokens: number; totalTokens: number }; error?: string; }
