'use server';

import { z } from 'zod';
import { db } from '@/db';
import { wallets } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { ActionState } from '@/types/actions';

const walletSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    balance: z.coerce.number().default(0),
    color: z.string().optional(),
});

export async function createWallet(formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        name: formData.get('name'),
        balance: formData.get('balance'),
        color: formData.get('color'),
    };

    const result = walletSchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    try {
        await db.insert(wallets).values({
            userId: user.id,
            name: result.data.name,
            balance: result.data.balance.toString(),
            color: result.data.color,
        });

        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error('Failed to create wallet:', error);
        return { error: 'Failed to create wallet' };
    }
}

export async function updateWallet(id: string, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        name: formData.get('name'),
        balance: formData.get('balance'),
        color: formData.get('color'),
    };

    const result = walletSchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    try {
        // Note: Updating balance directly here might conflict with transaction history.
        // For now, we allow it, but in a real app, balance adjustments should be transactions.
        await db.update(wallets)
            .set({
                name: result.data.name,
                balance: result.data.balance.toString(),
                color: result.data.color,
            })
            .where(and(eq(wallets.id, id), eq(wallets.userId, user.id)));

        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error('Failed to update wallet:', error);
        return { error: 'Failed to update wallet' };
    }
}

export async function deleteWallet(id: string): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        await db.delete(wallets).where(and(eq(wallets.id, id), eq(wallets.userId, user.id)));
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete wallet:', error);
        return { error: 'Failed to delete wallet' };
    }
}
