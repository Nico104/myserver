FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
# Prisma needs a value at build time; runtime will use .env from compose
ARG DATABASE_URL="postgresql://nibbler:nibblerpw@postgres:5432/nibbler"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate || true
RUN npm run build
# --- prove files are present ---
RUN ls -la /app && echo "---- dist ----" && ls -la /app/dist

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://nibbler:nibblerpw@postgres:5432/nibbler"
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 8088
CMD ["node", "dist/src/main.js"]

