'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';

const initialState = {
    error: '',
};

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, initialState);

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
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Kata Sandi</Label>
                    {/* Future: Add Forgot Password Link */}
                </div>
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
                        Sedang Masuk...
                    </>
                ) : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Masuk
                    </>
                )}
            </Button>
        </form>
    );
}
