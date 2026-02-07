'use server';

import { z } from 'zod';
import { db } from '@/db';
import { budgets } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { eq, and } from 'drizzle-orm';
import { ActionState } from '@/types/actions';

const budgetSchema = z.object({
    categoryId: z.string().uuid(),
    amount: z.coerce.number().positive("Budget amount must be positive"),
    period: z.string().regex(/^\d{4}-\d{2}$/, "Period format must be YYYY-MM"),
});

export async function setBudget(formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        categoryId: formData.get('categoryId'),
        amount: formData.get('amount'),
        period: formData.get('period'),
    };

    const result = budgetSchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    try {
        // Check if budget exists for this category and period
        const existingBudget = await db.query.budgets.findFirst({
            where: and(
                eq(budgets.userId, user.id),
                eq(budgets.categoryId, result.data.categoryId),
                eq(budgets.period, result.data.period)
            )
        });

        if (existingBudget) {
            await db.update(budgets)
                .set({
                    amount: result.data.amount.toString(),
                    updatedAt: new Date(),
                })
                .where(eq(budgets.id, existingBudget.id));
        } else {
            await db.insert(budgets).values({
                userId: user.id,
                categoryId: result.data.categoryId,
                amount: result.data.amount.toString(),
                period: result.data.period,
            });
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to set budget:', error);
        return { error: 'Failed to set budget' };
    }
}
