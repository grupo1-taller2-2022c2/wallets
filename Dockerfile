FROM node:18.12.1-buster-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

RUN npm run deploy-goerli

CMD ["npm", "run", "start"]