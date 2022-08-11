FROM node:16-alpine
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
RUN npm install --only=prod
CMD [ "npm", "run", "start" ]