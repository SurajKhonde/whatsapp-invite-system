FROM node:20

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 5000

CMD ["pnpm", "start"]