FROM node:alpine

WORKDIR /app

COPY docker/package.json docker/package-lock.json ./
RUN npm install

COPY docker/public ./public
COPY docker/server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
