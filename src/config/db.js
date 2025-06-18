import { neon } from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'
import { ENV } from './env.js'
import * as schema from '../db/schema.js'

const sql=neon(ENV.DATABASE_URL) //initializes a Neon client using your database URL
export const db=drizzle(sql,{schema}) // initializes the Drizzle ORM client using Neon SQL connection and attaches the schema for type safety and autocompletion.