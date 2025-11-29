'use client';

import { useActionState } from 'react';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react';

const initialState = {
    error: '',
};

export function SignupForm() {
    const [state, formAction, isPending] = useActionState(signup, initialState);

    return (
        <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="nama@contoh.com" 
                        required 
                        className="pl-9"
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="pl-9"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Minimal 6 karakter.</p>
            </div>
            
            {state?.error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <span className="font-medium">Error:</span> {state.error}
                </div>
            )}

            <Button className="w-full mt-2" type="submit" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mendaftar...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Daftar Akun
                    </>
                )}
            </Button>
        </form>
    );
}
