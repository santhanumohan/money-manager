'use client';

import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { id } from 'date-fns/locale';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EditTransactionDialog } from '../transactions/edit-transaction-dialog';
import { deleteTransaction } from '@/actions/transactions';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Transaction } from '@/types/data';

interface TransactionListProps {
    transactions: Transaction[];
    wallets: { id: string; name: string }[];
    categories: { id: string; name: string; type: 'income' | 'expense' }[];
}

export function TransactionList({ transactions, wallets, categories }: TransactionListProps) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const result = await deleteTransaction(id);
        if (result.success) {
            toast.success("Transaksi berhasil dihapus");
            setDeletingId(null);
        } else {
            toast.error("Gagal menghapus transaksi");
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Belum ada transaksi.
            </div>
        );
    }

    return (
        <>
            {/* Desktop View - Table-like Row */}
            <div className="space-y-4 hidden md:block">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-full",
                                transaction.type === 'income' ? "bg-green-100 text-green-600" :
                                    transaction.type === 'expense' ? "bg-red-100 text-red-600" :
                                        "bg-blue-100 text-blue-600"
                            )}>
                                {transaction.type === 'income' ? <ArrowDownLeft className="h-4 w-4" /> :
                                    transaction.type === 'expense' ? <ArrowUpRight className="h-4 w-4" /> :
                                        <ArrowRightLeft className="h-4 w-4" />}
                            </div>
                            <div>
                                <p className="font-medium">
                                    {transaction.type === 'transfer' && transaction.targetWallet
                                        ? `Transfer ke ${transaction.targetWallet.name}`
                                        : transaction.description || 'Tanpa Keterangan'}
                                </p>
                                <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                    {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: id })} • {transaction.category?.name || 'Umum'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className={cn("font-bold",
                                    transaction.type === 'income' ? "text-green-600" :
                                        transaction.type === 'expense' ? "text-red-600" :
                                            "text-blue-600"
                                )}>
                                    {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Number(transaction.amount))}
                                </p>
                                <p className="text-xs text-muted-foreground">{transaction.wallet.name}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(transaction.id)}>
                                        <Trash className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile View - Compact Card */}
            <div className="space-y-4 md:hidden">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-full shrink-0",
                                    transaction.type === 'income' ? "bg-green-100 text-green-600" :
                                        transaction.type === 'expense' ? "bg-red-100 text-red-600" :
                                            "bg-blue-100 text-blue-600"
                                )}>
                                    {transaction.type === 'income' ? <ArrowDownLeft className="h-4 w-4" /> :
                                        transaction.type === 'expense' ? <ArrowUpRight className="h-4 w-4" /> :
                                            <ArrowRightLeft className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm line-clamp-1">
                                        {transaction.type === 'transfer' && transaction.targetWallet
                                            ? `Transfer ke ${transaction.targetWallet.name}`
                                            : transaction.description || 'Tanpa Keterangan'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {transaction.category?.name || 'Umum'}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 -mr-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(transaction.id)}>
                                        <Trash className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        
                        <div className="flex justify-between items-end pt-1 border-t">
                            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                                {format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}
                            </p>
                            <div className="text-right">
                                <p className={cn("font-bold",
                                    transaction.type === 'income' ? "text-green-600" :
                                        transaction.type === 'expense' ? "text-red-600" :
                                            "text-blue-600"
                                )}>
                                    {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Number(transaction.amount))}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{transaction.wallet.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingTransaction && (
                <EditTransactionDialog
                    transaction={editingTransaction}
                    wallets={wallets}
                    categories={categories}
                    open={!!editingTransaction}
                    onOpenChange={(open) => !open && setEditingTransaction(null)}
                />
            )}

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus permanen dan saldo dompet akan disesuaikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deletingId && handleDelete(deletingId)}>
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
