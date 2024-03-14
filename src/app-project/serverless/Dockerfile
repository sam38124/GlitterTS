FROM node:18.15
WORKDIR /app
ADD . /app
WORKDIR /app
RUN npm install -g typescript
RUN npm install
RUN npm run build
RUN apt-get update
RUN apt-get install -y awscli
WORKDIR /app
CMD npm start

