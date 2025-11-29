import { LoginForm } from '@/components/auth/login-form';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
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
                    <CardTitle className="text-2xl font-bold">Selamat Datang Kembali</CardTitle>
                    <CardDescription>
                        Masuk untuk mengelola keuangan Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Belum punya akun?{' '}
                        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                            Daftar sekarang
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
