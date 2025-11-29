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
            Tanggal: format(new Date(t.date), 'yyyy-MM-dd'),
            Deskripsi: t.description || '',
            Tipe: t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer',
            Jumlah: Number(t.amount),
            Kategori: t.category?.name || '-',
            'Dompet Asal': t.wallet.name,
            'Dompet Tujuan': t.targetWallet?.name || '-',
        }));

        if (csvData.length === 0) {
            return { error: 'Tidak ada data untuk diekspor' };
        }

        const parser = new Parser();
        const csv = parser.parse(csvData);

        return { success: true, csv };
    } catch (error) {
        console.error('Export failed:', error);
        return { error: 'Gagal mengekspor data' };
    }
}
