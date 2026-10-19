FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies inside Linux container
COPY frontend/package*.json ./
RUN npm install

# Copy source files explicitly (prevents host node_modules contamination)
COPY frontend/tsconfig.json ./
COPY frontend/next.config.ts ./
COPY frontend/eslint.config.mjs ./
COPY frontend/src ./src
COPY frontend/public ./public

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
