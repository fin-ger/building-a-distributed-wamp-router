from node:12-alpine

add . /app
workdir /app

run apk add --no-cache git && \
  npm ci --unsafe-perm && \
  apk del git

CMD ["index.js"]
