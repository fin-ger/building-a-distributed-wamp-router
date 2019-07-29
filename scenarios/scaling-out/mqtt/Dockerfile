from node:12-alpine

add . /app
workdir /app

run apk add --no-cache python make g++
run npm ci

CMD ["index.js"]
