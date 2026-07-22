import { api } from './src/config/api'

async function run() {
  const t = typeof api.api.teacher.sessions({ id: 'abc' }).details.get
  console.log('type:', t)
}

run()
