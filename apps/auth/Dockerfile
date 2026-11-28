FROM node:22-slim AS builder

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY oxlintrc.json ./

COPY apps/auth ./apps/auth
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/prisma ./libs/prisma

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

RUN npx nx build auth

FROM node:22-slim AS runner

COPY --from=builder /workspace/package*.json ./
COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]