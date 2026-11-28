FROM node:22-slim AS builder

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY oxlintrc.json ./

COPY apps/executor ./apps/executor
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar

RUN npm install

RUN npx nx build executor

FROM node:22-slim AS runner

COPY --from=builder /workspace/package*.json ./
COPY --from=builder /workspace/apps/executor/package.json ./apps/executor/
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD [ "node", "dist/apps/executor/main" ]