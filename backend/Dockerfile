FROM oven/bun:1 AS base

# install dependencies
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && apt-get update && \
    apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json bun.lock ./
RUN bun install --production
COPY . .
RUN bun run gen:prisma
RUN bun run build

CMD [ "bun", "run", "dist/main.js" ]