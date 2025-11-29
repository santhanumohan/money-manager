import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Use global singleton for postgres client in development to prevent connection exhaustion
const globalQueryClient = global as unknown as { postgres: postgres.Sql };

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = globalQueryClient.postgres || postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') {
    globalQueryClient.postgres = client;
}

export const db = drizzle(client, { schema });
