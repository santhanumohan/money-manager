'use client';

import { formatCurrency } from '@/lib/utils';
import { CreateWalletDialog } from '@/components/wallets/create-wallet-dialog';
import { EditWalletDialog } from '@/components/wallets/edit-wallet-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from 'react';
import { deleteWallet } from '@/actions/wallets';
import { toast } from 'sonner';

interface Wallet {
    id: string;
    name: string;
    balance: number | string;
    color?: string | null;
    userId: string;
}

interface WalletsListProps {
    wallets: Wallet[];
}

export function WalletsList({ wallets }: WalletsListProps) {
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const result = await deleteWallet(id);
        if (result.success) {
            toast.success("Dompet berhasil dihapus");
            setDeletingId(null);
        } else {
            toast.error("Gagal menghapus dompet");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dompet</h2>
                <CreateWalletDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {wallets.map((wallet) => (
                    <Card key={wallet.id} style={{ borderLeft: `4px solid ${wallet.color || '#000'}` }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {wallet.name}
                            </CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setEditingWallet(wallet)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(wallet.id)}>
                                        <Trash className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(Number(wallet.balance))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {wallets.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        Tidak ada dompet ditemukan. Buat satu untuk memulai.
                    </div>
                )}
            </div>

            {editingWallet && (
                <EditWalletDialog
                    wallet={editingWallet}
                    open={!!editingWallet}
                    onOpenChange={(open) => !open && setEditingWallet(null)}
                />
            )}

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Dompet ini?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2 text-muted-foreground text-sm">
                                <p>
                                    Tindakan ini <strong>tidak dapat dibatalkan</strong>.
                                </p>
                                <p className="text-red-600 dark:text-red-400 font-medium">
                                    Peringatan: Menghapus dompet ini akan menghapus semua riwayat transaksi (Pemasukan & Pengeluaran) yang terkait secara permanen.
                                </p>
                                <p>
                                    Untuk transaksi Transfer, catatan pada dompet lawan akan tetap ada namun info dompet ini akan hilang.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deletingId && handleDelete(deletingId)}>
                            Ya, Hapus Permanen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
