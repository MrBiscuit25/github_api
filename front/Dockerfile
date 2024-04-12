FROM node:20.11.1

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install --slient

COPY . .

CMD ["npm","start"]
