import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1, prepare: false }); // Limit connections
const db = drizzle(client, { schema });

async function testQuery() {
    console.log('Running test query...');
    const userId = 'f9897ca7-a562-42a8-ab95-801b251c9fdc'; // From user error report

    try {
        const transactions = await db.query.transactions.findMany({
            where: eq(schema.transactions.userId, userId),
            orderBy: [desc(schema.transactions.date)],
            limit: 5,
            with: {
                wallet: true,
                targetWallet: true,
                category: true,
            },
        });
        console.log('Query successful:', transactions);
    } catch (error) {
        console.error('Query failed details:', error);
    } finally {
        await client.end();
    }
}

testQuery();
