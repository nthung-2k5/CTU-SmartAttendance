import staticPlugin from '@elysia/static';
import { Elysia, status } from "elysia";
import { env } from './config/env';
import './config/firebase';
import { checkinRoute } from './routes/checkin.route';

const app = new Elysia()
  .onError(({ error }) => {
    console.error(error)
    return 'Internal Server Error'
  })
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/',
    })
  )
  .use(checkinRoute)
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen({
    port: env.PORT,
    hostname: env.HOST,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
