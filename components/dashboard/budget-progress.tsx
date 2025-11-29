'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { copyPreviousMonthBudgets } from '@/actions/budget-copy';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';
import { Copy } from 'lucide-react';

interface BudgetProgressProps {
    budgets: {
        category: string;
        spent: number;
        limit: number;
    }[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
    const [loading, setLoading] = useState(false);

    async function handleCopy() {
        setLoading(true);
        const currentPeriod = format(new Date(), 'yyyy-MM');
        const result = await copyPreviousMonthBudgets(currentPeriod);
        
        if (result.success) {
            toast.success(result.data as string);
        } else {
            toast.error(result.error as string);
        }
        setLoading(false);
    }

    if (budgets.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Anggaran Bulanan</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleCopy} disabled={loading}>
                        <Copy className="h-4 w-4 mr-2" />
                        {loading ? 'Menyalin...' : 'Salin Bulan Lalu'}
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Belum ada anggaran yang diatur untuk bulan ini.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Anggaran Bulanan</CardTitle>
                {/* Optional: Add Edit/Manage Budget button here */}
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {budgets.map((budget) => {
                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isOverBudget = budget.spent > budget.limit;

                    return (
                        <div key={budget.category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{budget.category}</span>
                                <span className={isOverBudget ? "text-red-500 font-bold" : "text-muted-foreground"}>
                                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                                </span>
                            </div>
                            <Progress value={percentage} className={isOverBudget ? "bg-red-100 [&>*]:bg-red-500" : ""} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
