FROM node:22-slim AS builder

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY oxlintrc.json ./

COPY apps/jobs ./apps/jobs
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

RUN npx nx build jobs

FROM node:22-slim AS runner

COPY --from=builder /workspace/package*.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD [ "node", "dist/apps/jobs/main" ]