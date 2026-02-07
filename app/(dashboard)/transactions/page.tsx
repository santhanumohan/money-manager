import { transactions, wallets, categories } from '@/db/schema';
import { desc, eq, and, ilike, count, gte, lte } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';

import { redirect } from 'next/navigation';
import { CreateTransactionDialog } from '@/components/transactions/create-transaction-dialog';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { Pagination } from '@/components/ui/pagination';
import { ExportButton } from '@/components/common/export-button';
import { MobileFAB } from '@/components/transactions/mobile-fab';
import { startOfDay, endOfDay } from 'date-fns';

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string; type?: string; from?: string; to?: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const params = await searchParams;
    const query = params.query || '';
    const type = params.type || '';
    const fromDate = params.from;
    const toDate = params.to;
    const currentPage = Number(params.page) || 1;
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    const conditions = [eq(transactions.userId, user.id)];
    
    if (query) {
        conditions.push(ilike(transactions.description, `%${query}%`));
    }

    if (type && type !== 'all') {
        // @ts-expect-error - Drizzle enum type check might be strict
        conditions.push(eq(transactions.type, type));
    }

    if (fromDate) {
        conditions.push(gte(transactions.date, startOfDay(new Date(fromDate))));
    }

    if (toDate) {
        conditions.push(lte(transactions.date, endOfDay(new Date(toDate))));
    } else if (fromDate) {
        // If only 'from' is selected, filter for that specific day
        conditions.push(lte(transactions.date, endOfDay(new Date(fromDate))));
    }

    const [userTransactions, totalCount] = await Promise.all([
        db.query.transactions.findMany({
            where: and(...conditions),
            orderBy: [desc(transactions.date)],
            limit: itemsPerPage,
            offset: offset,
            with: {
                wallet: true,
                targetWallet: true,
                category: true,
            },
        }),
        db.select({ count: count() })
            .from(transactions)
            .where(and(...conditions))
            .then(res => res[0].count)
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const [userWallets, userCategories] = await Promise.all([
        db.query.wallets.findMany({
            where: eq(wallets.userId, user.id),
        }),
        db.query.categories.findMany({
            where: eq(categories.userId, user.id),
        }),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                <div className="flex gap-2">
                    <ExportButton />
                    <CreateTransactionDialog wallets={userWallets} categories={userCategories} />
                </div>
            </div>

            <TransactionFilters />

            <TransactionList
                transactions={userTransactions}
                wallets={userWallets}
                categories={userCategories}
            />

            <Pagination totalPages={totalPages} />
            <MobileFAB wallets={userWallets} categories={userCategories} />
        </div>
    );
}
