FROM node:latest
WORKDIR /usr/src/app-manel
COPY package*.json ./
RUN npm install
COPY . .
RUN chown -R node:node /usr/src/app-manel
USER node
EXPOSE 3000
CMD ["node", "app.js"]