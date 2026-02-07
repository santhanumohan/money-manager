'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/forms/transaction-form';
import { Transaction } from '@/types/data';

interface EditTransactionDialogProps {
    transaction: Transaction;
    wallets: { id: string; name: string }[];
    categories: { id: string; name: string; type: 'income' | 'expense' }[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ transaction, wallets, categories, open, onOpenChange }: EditTransactionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit transaction</DialogTitle>
                    <DialogDescription>
                        Update the transaction details below.
                    </DialogDescription>
                </DialogHeader>
                <TransactionForm
                    wallets={wallets}
                    categories={categories}
                    defaultValues={{
                        amount: Number(transaction.amount),
                        type: transaction.type,
                        walletId: transaction.walletId,
                        targetWalletId: transaction.targetWalletId || undefined,
                        categoryId: transaction.categoryId || undefined,
                        date: new Date(transaction.date),
                        description: transaction.description || '',
                    }}
                    transactionId={transaction.id}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
