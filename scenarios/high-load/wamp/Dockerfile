from node:12-alpine

add . /app
workdir /app

run apk add --no-cache git
run npm ci --unsafe-perm

CMD ["index.js"]
