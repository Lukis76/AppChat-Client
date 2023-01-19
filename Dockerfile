#############################
FROM node:18.12.1-alpine AS deps

WORKDIR /app
RUN npm install -g npm@9.3.1

COPY package*.json ./
RUN npm install --frozen-lockfile
RUN npx prisma generate

#########################################
FROM node:18.12.1-alpine AS build_image

WORKDIR /app
RUN npm install -g npm@9.3.1

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build
RUN rm -rf node_modules
RUN npm install --frozen-lockfile --omit=dev --ignore-scripts --prefer-offline
RUN npx prisma generate
#########################################
FROM node:18.12.1-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

COPY --from=build_image --chown=nextjs:nodejs /app/package.json ./
COPY --from=build_image --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build_image --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build_image --chown=nextjs:nodejs /app/next.config.js ./

ENV NEXT_TELEMETRY_DISABLED 1



USER nextjs

EXPOSE 8080

CMD [ "npm", "start" ]


