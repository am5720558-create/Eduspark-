# Convo AI Monorepo

Apps:
- apps/server: Fastify + Prisma API for streaming chat (SSE), conversation memory (SQLite), OpenAI provider.
- apps/web: Next.js 14 chat UI with settings, voice input/output.

Quick start:
1) Copy .env.example to .env and set OPENAI_API_KEY
2) Install deps and generate DB

```
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Server
- POST /v1/chat: JSON body { conversationId?, messages: [{role, content}], settings?, stream? }
- GET /v1/chat/stream?payload=...: SSE stream for EventSource clients
- ENV: DATABASE_URL (SQLite), PORT (default 8787)

Web
- Run at http://localhost:3000
- Set NEXT_PUBLIC_API_BASE to point to server if different origin

Optional features
- TTS/STT via browser APIs (no server keys needed)
- Future toggles: browsing, vision, TTI (wiring in env flags already present)

Deploy
- Add Dockerfiles and a reverse proxy (e.g., Nginx) for CORS. Use managed SQLite (or Postgres) in production.
