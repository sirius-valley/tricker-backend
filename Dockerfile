# Install dependencies
FROM node:lts-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

# Build source code
FROM node:lts-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run db:generate
RUN npm run build

# Production runtime
FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD npm run prod

# Development runtime
FROM node:lts-alpine AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY nodemon.json ./nodemon.json
COPY tsconfig.json ./tsconfig.json
COPY . .

CMD npm run dev