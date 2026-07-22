import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { env } from '../config/env'
import { relations } from './relations'

const client = new SQL(env.DATABASE_URL, { prepare: false })
export const db = drizzle({ relations, client })
