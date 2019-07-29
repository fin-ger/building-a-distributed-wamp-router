from node:12-alpine

add . /app
workdir /app

run apk add --no-cache git python make g++ && \
  npm ci --unsafe-perm && \
  apk del git python make g++

CMD ["index.js"]
