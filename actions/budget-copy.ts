'use server';

import { db } from '@/db';
import { budgets } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { format, subMonths, parse } from 'date-fns';
import { ActionState } from '@/types/actions';

export async function copyPreviousMonthBudgets(currentPeriod: string): Promise<ActionState<string>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        // Calculate previous period
        const currentDate = parse(currentPeriod, 'yyyy-MM', new Date());
        const previousPeriod = format(subMonths(currentDate, 1), 'yyyy-MM');

        // Fetch previous month's budgets
        const previousBudgets = await db.query.budgets.findMany({
            where: and(
                eq(budgets.userId, user.id),
                eq(budgets.period, previousPeriod)
            )
        });

        if (previousBudgets.length === 0) {
            return { error: 'No budgets found in previous month' };
        }

        // Fetch current month's budgets to avoid duplicates
        const currentBudgets = await db.query.budgets.findMany({
            where: and(
                eq(budgets.userId, user.id),
                eq(budgets.period, currentPeriod)
            )
        });

        const existingCategoryIds = new Set(currentBudgets.map(b => b.categoryId));
        
        // Filter out budgets that already exist in current month
        const newBudgets = previousBudgets
            .filter(b => !existingCategoryIds.has(b.categoryId))
            .map(b => ({
                userId: user.id,
                categoryId: b.categoryId,
                amount: b.amount,
                period: currentPeriod,
            }));

        if (newBudgets.length > 0) {
            await db.insert(budgets).values(newBudgets);
            revalidatePath('/');
            return { success: true, data: `Copied ${newBudgets.length} budgets` };
        }

        return { success: true, data: 'No new budgets to copy' };

    } catch (error) {
        console.error('Failed to copy budgets:', error);
        return { error: 'Failed to copy budgets' };
    }
}
