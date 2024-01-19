FROM node:18

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
EXPOSE 40000-49999/udp

CMD ["npm", "start"]
