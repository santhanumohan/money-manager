import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function main() {
    const triggersPath = path.join(process.cwd(), 'db', 'triggers.sql');
    const triggersSql = fs.readFileSync(triggersPath, 'utf-8');

    console.log('Applying triggers...');
    try {
        await db.execute(sql.raw(triggersSql));
        console.log('Triggers applied successfully.');
    } catch (error) {
        console.error('Failed to apply triggers:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
