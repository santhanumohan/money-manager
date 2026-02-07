'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/forms/transaction-form';

interface MobileFABProps {
    wallets: { id: string; name: string }[];
    categories: { id: string; name: string; type: 'income' | 'expense' }[];
}

export function MobileFAB({ wallets, categories }: MobileFABProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90">
                        <Plus className="h-6 w-6 text-primary-foreground" />
                        <span className="sr-only">Add transaction</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add transaction</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new transaction.
                        </DialogDescription>
                    </DialogHeader>
                    <TransactionForm wallets={wallets} categories={categories} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
