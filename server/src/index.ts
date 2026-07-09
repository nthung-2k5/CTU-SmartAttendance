import staticPlugin from '@elysia/static';
import { Elysia } from "elysia";
import { env } from './config/env';
import './config/firebase';

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
  )
  .get("/", () => "Hello Elysia")
  .listen({
    port: env.PORT,
    hostname: env.HOST,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
