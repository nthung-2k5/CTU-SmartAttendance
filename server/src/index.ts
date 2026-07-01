import staticPlugin from '@elysia/static';
import { Elysia } from "elysia";

const app = new Elysia()
  .onError(({ error }) => {
    console.error(error)
    return 'Internal Server Error'
  })
  .use(
    await staticPlugin({
      prefix: '/',
      bunFullstack: true,
      alwaysStatic: true,
    }),
  ).get("/", () => "Hello Elysia").listen({
    port: 3000,
    hostname: '0.0.0.0',
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
