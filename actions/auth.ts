'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ActionState } from '@/types/actions';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const profileSchema = z.object({
    fullName: z.string().min(2, "Nama lengkap minimal 2 karakter").optional(),
});

export async function updateProfile(formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    
    const rawData = {
        fullName: formData.get('fullName'),
    };

    const result = profileSchema.safeParse(rawData);

    if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: result.error.flatten().fieldErrors as any };
    }

    const { error } = await supabase.auth.updateUser({
        data: { full_name: result.data.fullName }
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/settings');
    return { success: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Invalid input' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Invalid input' };
    }

    const { error } = await supabase.auth.signUp(result.data);

    if (error) {
        return { error: error.message };
    }

    redirect('/login?message=Check email to continue sign in process');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}
