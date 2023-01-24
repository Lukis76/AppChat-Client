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

ENV GOOGLE_CLIENT_ID="999338956671-93ma67gtiad33rh3ll1rqnnamhf7a1ah.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"
ENV DATABASE_URL="mongodb+srv://lucas:67p6L2BVKoZGeFeK@cluster0.6uhshd9.mongodb.net/ChatGraphQl"
ENV NEXTAUTH_SECRET="LQZWmi6PNX9XKdN7ZI0EadKccqa30E2FdSBvk1HlBtc="
ENV NEXTAUTH_URL="https://clientchat.fly.dev"
ENV GRAPHQL_URI="https://backchat.fly.dev"
ENV GRAPHQL_URI_SUB="wss://backchat.fly.dev"
ENV PUBLIC_URL="https://clientchat.fly.dev"



USER nextjs

EXPOSE 8080

CMD [ "npm", "start" ]


