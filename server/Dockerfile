FROM node:18

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose TCP port for your application's server
EXPOSE 5000

# Expose UDP port range for mediasoup
EXPOSE 40000-49999/udp

CMD ["npm", "start"]
