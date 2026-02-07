import { getCategoryBreakdown, getPeriodSummary } from '@/actions/analytics';
import { MonthFilter } from '@/components/analytics/month-filter';
import { ExpensePieChart } from '@/components/analytics/expense-pie-chart';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ExportButton } from '@/components/common/export-button';

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ period?: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const params = await searchParams;
    const period = params.period || format(new Date(), 'yyyy-MM');

    const [summary, categoryData] = await Promise.all([
        getPeriodSummary(period),
        getCategoryBreakdown(period),
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground mt-1">
                        Detailed financial reports by period.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <ExportButton />
                    <MonthFilter />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Income"
                    value={formatCurrency(summary.income)}
                    icon={TrendingUp}
                    iconColor="text-emerald-500"
                    iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
                    description="Total income for this period"
                />
                <SummaryCard
                    title="Expenses"
                    value={formatCurrency(summary.expense)}
                    icon={TrendingDown}
                    iconColor="text-red-500"
                    iconBgColor="bg-red-100 dark:bg-red-900/20"
                    description="Total expenses for this period"
                />
                <SummaryCard
                    title="Net Savings"
                    value={formatCurrency(summary.savings)}
                    icon={PiggyBank}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                    description="Income minus expenses"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ExpensePieChart data={categoryData} />
                {/* Future: Income breakdown or other charts */}
            </div>
        </div>
    );
}
