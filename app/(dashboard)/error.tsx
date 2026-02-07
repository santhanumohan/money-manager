'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-6">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>We couldn&apos;t load your dashboard</CardTitle>
                    <CardDescription>
                        Something went wrong while loading your data. Please try again, or sign in again if the issue persists.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={reset}>Try again</Button>
                    <Button variant="outline" asChild>
                        <Link href="/login">Go to login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
