'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react';

const initialState = {
    error: '',
};

export function SignupForm() {
    const [state, formAction] = useFormState(signup, initialState);

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
                        placeholder="name@example.com" 
                        required 
                        className="pl-9"
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
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
                <p className="text-xs text-muted-foreground">At least 6 characters.</p>
            </div>
            
            {state?.error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <span className="font-medium">Error:</span> {state.error}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full mt-2" type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                </>
            ) : (
                <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                </>
            )}
        </Button>
    );
}
