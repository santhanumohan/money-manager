import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { transactions } from '../db/schema';
import { sql, eq, and, gte, lte } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1, prepare: false });
const db = drizzle(client);

async function testAnalyticsQuery() {
    console.log('Testing analytics query...');
    const userId = 'f9897ca7-a562-42a8-ab95-801b251c9fdc';
    const startDate = new Date('2025-06-01T00:00:00.000Z');
    const endDate = new Date('2025-11-30T00:00:00.000Z');

    try {
        const result = await db
            .select({
                month: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`,
                amount: sql<number>`sum(${transactions.amount})`
            })
            .from(transactions)
            .where(and(
                eq(transactions.userId, userId),
                eq(transactions.type, 'expense'),
                gte(transactions.date, startDate),
                lte(transactions.date, endDate)
            ))
            .groupBy(sql`to_char(${transactions.date}, 'YYYY-MM')`)
            .orderBy(sql`to_char(${transactions.date}, 'YYYY-MM')`);

        console.log('Query success:', result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Query failed!');
        console.error('Error message:', error.message);
        if (error.cause) {
            console.error('Error cause:', error.cause);
        }
    } finally {
        await client.end();
    }
}

testAnalyticsQuery();
