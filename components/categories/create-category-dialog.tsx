'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryForm } from '@/components/forms/category-form';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function CreateCategoryDialog() {
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
                    <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat Kategori Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan kategori baru untuk mengelompokkan transaksi Anda.
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm onSuccess={() => handleOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
