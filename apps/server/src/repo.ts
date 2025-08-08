import { PrismaClient } from "@prisma/client";
import { ChatMessage } from "./types.js";
const prisma = new PrismaClient();

export async function ensureConversation(conversationId?: string) {
  if (conversationId) {
    const existing = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (existing) return existing.id;
  }
  const c = await prisma.conversation.create({ data: {} });
  return c.id;
}

export async function appendMessages(conversationId: string, messages: ChatMessage[]) {
  if (messages.length === 0) return;
  await prisma.message.createMany({ data: messages.map((m) => ({ conversationId, role: m.role, content: m.content })) });
}

export async function getHistory(conversationId: string, limit = 50): Promise<ChatMessage[]> {
  const rows = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" }, take: limit });
  return rows.map((r) => ({ id: r.id, role: r.role as any, content: r.content }));
}
