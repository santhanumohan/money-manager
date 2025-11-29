import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1, prepare: false }); // Limit connections & disable prepare
const db = drizzle(client);

async function migrate() {
    console.log('Running migration...');
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "budgets" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "category_id" uuid NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
                "amount" numeric(12, 2) NOT NULL,
                "period" text NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL
            );
        `);
        
        await db.execute(sql`CREATE INDEX IF NOT EXISTS "budgets_user_id_idx" ON "budgets" ("user_id");`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS "budgets_category_id_idx" ON "budgets" ("category_id");`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS "budgets_period_idx" ON "budgets" ("period");`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS "budgets_user_period_idx" ON "budgets" ("user_id", "period");`);

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.end(); // Close connection
    }
    process.exit(0);
}

migrate();
