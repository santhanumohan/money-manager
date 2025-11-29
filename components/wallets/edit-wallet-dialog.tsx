'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WalletForm } from '@/components/forms/wallet-form';

interface Wallet {
    id: string;
    name: string;
    balance: number | string;
    color?: string | null;
}

interface EditWalletDialogProps {
    wallet: Wallet;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditWalletDialog({ wallet, open, onOpenChange }: EditWalletDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Dompet</DialogTitle>
                    <DialogDescription>
                        Ubah detail dompet Anda di sini.
                    </DialogDescription>
                </DialogHeader>
                <WalletForm
                    onSuccess={() => onOpenChange(false)}
                    defaultValues={{
                        name: wallet.name,
                        balance: Number(wallet.balance),
                        color: wallet.color || '#000000',
                    }}
                    walletId={wallet.id}
                />
            </DialogContent>
        </Dialog>
    );
}
