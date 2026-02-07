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
                    <Plus className="mr-2 h-4 w-4" /> Add Wallet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new wallet</DialogTitle>
                    <DialogDescription>
                        Add a wallet to track your finances.
                    </DialogDescription>
                </DialogHeader>
                <WalletForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
