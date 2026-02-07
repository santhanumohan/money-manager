'use server';

import { db } from '@/db';
import { transactions } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, and, desc, ilike, gte, lte } from 'drizzle-orm';
import { Parser } from 'json2csv';
import { format, startOfDay, endOfDay } from 'date-fns';

export async function exportTransactionsToCSV(query?: string, type?: string, from?: string, to?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const conditions = [eq(transactions.userId, user.id)];
    
    if (query) {
        conditions.push(ilike(transactions.description, `%${query}%`));
    }

    if (type && type !== 'all') {
        // @ts-expect-error - Drizzle enum type check might be strict
        conditions.push(eq(transactions.type, type));
    }

    if (from) {
        conditions.push(gte(transactions.date, startOfDay(new Date(from))));
    }

    if (to) {
        conditions.push(lte(transactions.date, endOfDay(new Date(to))));
    } else if (from) {
        conditions.push(lte(transactions.date, endOfDay(new Date(from))));
    }

    try {
        const data = await db.query.transactions.findMany({
            where: and(...conditions),
            orderBy: [desc(transactions.date)],
            with: {
                wallet: true,
                targetWallet: true,
                category: true,
            },
        });

        const csvData = data.map(t => ({
            Date: format(new Date(t.date), 'yyyy-MM-dd'),
            Description: t.description || '',
            Type: t.type === 'income' ? 'Income' : t.type === 'expense' ? 'Expense' : 'Transfer',
            Amount: Number(t.amount),
            Category: t.category?.name || '-',
            'Source Wallet': t.wallet.name,
            'Target Wallet': t.targetWallet?.name || '-',
        }));

        if (csvData.length === 0) {
            return { error: 'No data available to export' };
        }

        const parser = new Parser();
        const csv = parser.parse(csvData);

        return { success: true, csv };
    } catch (error) {
        console.error('Export failed:', error);
        return { error: 'Failed to export data' };
    }
}
