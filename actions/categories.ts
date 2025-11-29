'use server';

import { z } from 'zod';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { ActionState } from '@/types/actions';

const categorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    type: z.enum(['income', 'expense']),
    color: z.string().optional(),
});

export async function createCategory(formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        color: formData.get('color'),
    };

    const result = categorySchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    try {
        // Check for duplicates
        const existing = await db.query.categories.findFirst({
            where: and(
                eq(categories.userId, user.id),
                eq(categories.name, result.data.name),
                eq(categories.type, result.data.type)
            )
        });

        if (existing) {
            return { error: 'Kategori dengan nama ini sudah ada' };
        }

        await db.insert(categories).values({
            userId: user.id,
            name: result.data.name,
            type: result.data.type,
            color: result.data.color,
        });

        revalidatePath('/categories');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to create category:', error);
        return { error: 'Failed to create category' };
    }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        color: formData.get('color'),
    };

    const result = categorySchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    try {
        await db.update(categories)
            .set({
                name: result.data.name,
                type: result.data.type,
                color: result.data.color,
            })
            .where(and(eq(categories.id, id), eq(categories.userId, user.id)));

        revalidatePath('/categories');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to update category:', error);
        return { error: 'Failed to update category' };
    }
}

export async function deleteCategory(id: string): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, user.id)));
        
        revalidatePath('/categories');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { error: 'Gagal menghapus kategori. Pastikan tidak ada transaksi yang terhubung.' };
    }
}

const DEFAULT_CATEGORIES = [
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investments', type: 'income' },
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Housing', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Health', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
] as const;

export async function seedCategories(): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        const existingCategories = await db.query.categories.findMany({
            where: eq(categories.userId, user.id),
        });

        const existingNames = new Set(existingCategories.map(c => c.name));

        const values = DEFAULT_CATEGORIES
            .filter(c => !existingNames.has(c.name))
            .map(c => ({
                userId: user.id,
                name: c.name,
                type: c.type,
            }));

        if (values.length > 0) {
            await db.insert(categories).values(values);
            revalidatePath('/transactions');
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to seed categories:', error);
        return { error: 'Failed to seed categories' };
    }
}

export async function getCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    return await db.query.categories.findMany({
        where: eq(categories.userId, user.id),
    });
}
