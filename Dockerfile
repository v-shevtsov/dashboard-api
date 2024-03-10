FROM node:18-alpine

WORKDIR /work

ADD package.json package.json
RUN npm i

ADD . .

RUN npm run build
RUN npm prune --production

CMD ["node", "dist/main.js"]
