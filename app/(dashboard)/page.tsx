import { formatCurrency } from '@/lib/utils';
import { wallets, transactions, categories, budgets } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { CreateWalletDialog } from '@/components/wallets/create-wallet-dialog';
import { SeedCategoriesButton } from '@/components/dashboard/seed-categories-button';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { BudgetProgress } from '@/components/dashboard/budget-progress';
import { BudgetHistoryChart } from '@/components/dashboard/budget-chart';
import { Wallet, CreditCard, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { getSixMonthHistory } from '@/actions/analytics';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const currentMonth = format(new Date(), 'yyyy-MM');

    const [userWallets, recentTransactions, userCategories, userBudgets, historyData] = await Promise.all([
        db.query.wallets.findMany({
            where: eq(wallets.userId, user.id),
        }),
        db.query.transactions.findMany({
            where: eq(transactions.userId, user.id),
            orderBy: [desc(transactions.date)],
            limit: 5,
            with: {
                wallet: true,
                targetWallet: true,
                category: true,
            },
        }),
        db.query.categories.findMany({
            where: eq(categories.userId, user.id),
        }),
        db.query.budgets.findMany({
            where: and(
                eq(budgets.userId, user.id),
                eq(budgets.period, currentMonth)
            ),
            with: {
                category: true
            }
        }),
        getSixMonthHistory()
    ]);

    // Calculate spending for each budget
    const budgetData = await Promise.all(userBudgets.map(async (budget) => {
        const result = await db
            .select({
                total: sql<string>`sum(${transactions.amount})`
            })
            .from(transactions)
            .where(and(
                eq(transactions.userId, user.id),
                eq(transactions.categoryId, budget.categoryId),
                eq(transactions.type, 'expense'),
                sql`to_char(${transactions.date}, 'YYYY-MM') = ${currentMonth}`
            ));

        return {
            category: budget.category.name,
            spent: Number(result[0]?.total || 0),
            limit: Number(budget.amount)
        };
    }));

    const totalBalance = userWallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                        A snapshot of your finances today.
                    </p>
                </div>
                {userCategories.length === 0 && (
                    <SeedCategoriesButton />
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Total Balance"
                    value={formatCurrency(totalBalance)}
                    icon={Wallet}
                    iconColor="text-emerald-500"
                    iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
                    description="Net worth across all wallets"
                />
                <SummaryCard
                    title="Total Wallets"
                    value={userWallets.length}
                    icon={CreditCard}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                    description="Active accounts"
                />
                <SummaryCard
                    title="Recent Activity"
                    value={`${recentTransactions.length} activities`}
                    icon={Activity}
                    iconColor="text-violet-500"
                    iconBgColor="bg-violet-100 dark:bg-violet-900/20"
                    description="Latest transactions"
                />
            </div>

            {userWallets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No wallets yet</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Create your first wallet to start tracking income and expenses.
                    </p>
                    <CreateWalletDialog />
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        <BudgetHistoryChart data={historyData} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <TransactionList transactions={recentTransactions} wallets={userWallets} categories={userCategories} />
                        <BudgetProgress budgets={budgetData} />
                    </div>
                </>
            )}
        </div>
    );
}
