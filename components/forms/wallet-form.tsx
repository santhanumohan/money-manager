'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createWallet, updateWallet } from '@/actions/wallets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    balance: z.coerce.number().default(0),
    color: z.string().optional(),
});

interface WalletFormProps {
    onSuccess: () => void;
    defaultValues?: Partial<z.infer<typeof formSchema>>;
    walletId?: string;
}

export function WalletForm({ onSuccess, defaultValues, walletId }: WalletFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: defaultValues || {
            name: '',
            balance: 0,
            color: '#000000',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('balance', values.balance.toString());
        formData.append('color', values.color || '');

        let result;
        if (walletId) {
            result = await updateWallet(walletId, formData);
        } else {
            result = await createWallet(formData);
        }

        setLoading(false);

        if (result?.success) {
            toast.success(walletId ? "Dompet berhasil diperbarui" : "Dompet berhasil dibuat");
            form.reset();
            onSuccess();
        } else {
            console.error(result?.error);
            toast.error(walletId ? "Gagal memperbarui dompet" : "Gagal membuat dompet");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input placeholder="Tunai, Bank, dll." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="balance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Saldo Awal</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Warna</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" className="w-12 h-10 p-1 cursor-pointer" {...field} />
                                        <Input
                                            type="text"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="#000000"
                                            className="uppercase"
                                            maxLength={7}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Dompet'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
