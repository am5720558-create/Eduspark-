import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { env } from "./env.js";
import { OpenAIProvider } from "./providers/openaiProvider.js";
import { appendMessages, ensureConversation, getHistory } from "./repo.js";
import type { ChatMessage } from "./types.js";

const app = Fastify({
  logger: { level: "info", redact: ["req.headers.authorization", "req.headers.cookie"] }
});
await app.register(cors, { origin: true });
await app.register(rateLimit, { max: 60, timeWindow: "1 minute" });

const openai = new OpenAIProvider(env.OPENAI_API_KEY);

app.get("/health", async () => ({ status: "ok" }));

const chatSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(z.object({ role: z.enum(["system","user","assistant","tool"]), content: z.string() })),
  settings: z.object({ model: z.string().default("gpt-4o-mini"), temperature: z.number().min(0).max(2).optional(), maxTokens: z.number().optional(), systemPrompt: z.string().optional(), locale: z.string().optional(), tone: z.string().optional() }).partial().optional(),
  stream: z.boolean().default(true).optional()
});

app.post("/v1/chat", async (req, reply) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) { reply.code(400); return { error: parsed.error.flatten() }; }
  const { conversationId, messages, settings, stream } = parsed.data;
  const convId = await ensureConversation(conversationId);

  const history = await getHistory(convId);
  const fullMessages: ChatMessage[] = [...history, ...messages];

  if (stream) {
    reply.headers({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    const send = (data: any) => { reply.raw.write(`data: ${JSON.stringify(data)}\n\n`); };
    const generator = await openai.streamChat(fullMessages, settings || {});
    send({ type: "meta", conversationId: convId });
    for await (const chunk of generator) { send(chunk); }
    reply.raw.end();
    await appendMessages(convId, messages);
    return reply;
  } else {
    let text = ""; const generator = await openai.streamChat(fullMessages, settings || {});
    for await (const chunk of generator) { if (chunk.type === "delta" && chunk.delta) text += chunk.delta; }
    await appendMessages(convId, [...messages, { role: "assistant", content: text }]);
    return { conversationId: convId, content: text };
  }
});

app.get("/v1/chat/stream", async (req, reply) => {
  const { payload } = (req.query as any) || {};
  const body = typeof payload === "string" ? JSON.parse(payload) : payload;
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) { reply.code(400); return { error: parsed.error.flatten() }; }
  const { conversationId, messages, settings } = parsed.data;
  const convId = await ensureConversation(conversationId);
  const history = await getHistory(convId);
  const fullMessages: ChatMessage[] = [...history, ...messages];

  reply.headers({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const send = (data: any) => { reply.raw.write(`data: ${JSON.stringify(data)}\n\n`); };
  const generator = await openai.streamChat(fullMessages, settings || {});
  send({ type: "meta", conversationId: convId });
  for await (const chunk of generator) { send(chunk); }
  reply.raw.end();
  await appendMessages(convId, messages);
  return reply;
});

const port = env.PORT;
app.listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Server listening on http://localhost:${port}`))
  .catch((err) => { app.log.error(err); process.exit(1); });
