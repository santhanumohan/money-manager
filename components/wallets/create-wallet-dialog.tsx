'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { WalletForm } from '@/components/forms/wallet-form';

export function CreateWalletDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Dompet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat Dompet Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan dompet baru untuk melacak keuangan Anda.
                    </DialogDescription>
                </DialogHeader>
                <WalletForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
