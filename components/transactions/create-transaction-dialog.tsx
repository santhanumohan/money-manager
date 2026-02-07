'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { TransactionForm } from '@/components/forms/transaction-form';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface CreateTransactionDialogProps {
    wallets: { id: string; name: string }[];
    categories: { id: string; name: string; type: 'income' | 'expense' }[];
}

export function CreateTransactionDialog({ wallets, categories }: CreateTransactionDialogProps) {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            // Use setTimeout to avoid synchronous state update warning in effect
            const timer = setTimeout(() => setOpen(true), 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            const params = new URLSearchParams(searchParams);
            params.delete('action');
            router.replace(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add transaction</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new transaction.
                    </DialogDescription>
                </DialogHeader>
                <TransactionForm wallets={wallets} categories={categories} onSuccess={() => handleOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
