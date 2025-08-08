FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
RUN npm install --workspaces --include-workspace-root=false --production=false

FROM deps AS build
COPY . .
WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/package.json ./package.json
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
