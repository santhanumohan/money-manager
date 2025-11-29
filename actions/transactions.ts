'use server';

import { z } from 'zod';
import { db } from '@/db';
import { transactions, wallets, categories } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { eq, and } from 'drizzle-orm';

const transactionSchema = z.object({
    walletId: z.string().uuid(),
    targetWalletId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    amount: z.coerce.number().positive(),
    type: z.enum(['income', 'expense', 'transfer']),
    date: z.coerce.date(),
    description: z.string().optional(),
}).refine((data) => {
    if (data.type === 'transfer' && !data.targetWalletId) {
        return false;
    }
    if (data.type !== 'transfer' && data.targetWalletId) {
        return false;
    }
    return true;
}, {
    message: "Target wallet is required for transfers and must be empty for other types",
    path: ["targetWalletId"],
});

async function validateOwnership(userId: string, data: { walletId: string, targetWalletId?: string | null, categoryId?: string | null }) {
    // Check wallet
    const wallet = await db.query.wallets.findFirst({
        where: and(eq(wallets.id, data.walletId), eq(wallets.userId, userId))
    });
    if (!wallet) return "Invalid wallet or access denied";

    // Check target wallet
    if (data.targetWalletId) {
         const targetWallet = await db.query.wallets.findFirst({
            where: and(eq(wallets.id, data.targetWalletId), eq(wallets.userId, userId))
        });
        if (!targetWallet) return "Invalid target wallet or access denied";
    }

    // Check category
    if (data.categoryId) {
         const category = await db.query.categories.findFirst({
            where: and(eq(categories.id, data.categoryId), eq(categories.userId, userId))
        });
        if (!category) return "Invalid category or access denied";
    }

    return null;
}

export async function addTransaction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        walletId: formData.get('walletId'),
        targetWalletId: formData.get('targetWalletId') || undefined,
        categoryId: formData.get('categoryId') || undefined,
        amount: formData.get('amount'),
        type: formData.get('type'),
        date: formData.get('date'),
        description: formData.get('description'),
    };

    const result = transactionSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten() };
    }

    const ownershipError = await validateOwnership(user.id, {
        walletId: result.data.walletId,
        targetWalletId: result.data.targetWalletId,
        categoryId: result.data.categoryId
    });

    if (ownershipError) {
        return { error: ownershipError };
    }

    try {
        await db.insert(transactions).values({
            userId: user.id,
            walletId: result.data.walletId,
            targetWalletId: result.data.targetWalletId,
            categoryId: result.data.categoryId,
            amount: result.data.amount.toString(),
            type: result.data.type,
            date: result.data.date,
            description: result.data.description,
        });

        revalidatePath('/', 'layout'); 
        return { success: true };
    } catch (error) {
        console.error('Failed to add transaction:', error);
        return { error: 'Failed to add transaction' };
    }
}

export async function updateTransaction(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        walletId: formData.get('walletId'),
        targetWalletId: formData.get('targetWalletId') || undefined,
        categoryId: formData.get('categoryId') || undefined,
        amount: formData.get('amount'),
        type: formData.get('type'),
        date: formData.get('date'),
        description: formData.get('description'),
    };

    const result = transactionSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten() };
    }

    const ownershipError = await validateOwnership(user.id, {
        walletId: result.data.walletId,
        targetWalletId: result.data.targetWalletId,
        categoryId: result.data.categoryId
    });

    if (ownershipError) {
        return { error: ownershipError };
    }

    try {
        await db.update(transactions)
            .set({
                walletId: result.data.walletId,
                targetWalletId: result.data.targetWalletId,
                categoryId: result.data.categoryId,
                amount: result.data.amount.toString(),
                type: result.data.type,
                date: result.data.date,
                description: result.data.description,
            })
            .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to update transaction:', error);
        return { error: 'Failed to update transaction' };
    }
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        await db.delete(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { error: 'Failed to delete transaction' };
    }
}
