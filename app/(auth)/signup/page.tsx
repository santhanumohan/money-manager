import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 lg:p-8">
            <div className="mb-8 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Money Manager</h1>
            </div>

            <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-border/50">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
                    <CardDescription>
                        Mulai kelola keuangan Anda hari ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                            Masuk sekarang
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Money Manager. All rights reserved.</p>
            </div>
        </div>
    );
}
