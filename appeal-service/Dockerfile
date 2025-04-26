FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=prod

EXPOSE 3001

CMD ["node", "dist/server.js"]