FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/
RUN npm install --omit=dev --workspaces=false && \
    npm install --workspaces --include-workspace-root=false --production=false
COPY . .
WORKDIR /app/apps/server
RUN npx prisma generate && npm run build
EXPOSE 8787
CMD ["node", "dist/index.js"]
