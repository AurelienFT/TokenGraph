FROM node:16.0.0-slim

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .