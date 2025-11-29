'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addTransaction, updateTransaction } from '@/actions/transactions';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    amount: z.coerce.number().positive("Jumlah harus lebih dari 0"),
    type: z.enum(['income', 'expense', 'transfer']),
    walletId: z.string().uuid("Dompet asal harus dipilih"),
    targetWalletId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    date: z.date({
        message: "Tanggal harus dipilih",
    }),
    description: z.string().optional(),
}).refine((data) => {
    if (data.type === 'transfer' && !data.targetWalletId) {
        return false;
    }
    if (data.type !== 'transfer' && data.targetWalletId) {
        return false;
    }
    return true;
}, {
    message: "Dompet tujuan wajib diisi untuk transfer",
    path: ["targetWalletId"],
});

interface TransactionFormProps {
    wallets: { id: string; name: string }[];
    categories: { id: string; name: string; type: 'income' | 'expense' }[];
    onSuccess: () => void;
    defaultValues?: Partial<z.infer<typeof formSchema>>;
    transactionId?: string;
}

export function TransactionForm({ wallets, categories, onSuccess, defaultValues, transactionId }: TransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: defaultValues || {
            amount: 0,
            type: 'expense',
            date: new Date(),
            description: '',
        },
    });

    const type = form.watch('type');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append('amount', values.amount.toString());
        formData.append('type', values.type);
        formData.append('walletId', values.walletId);
        if (values.targetWalletId) formData.append('targetWalletId', values.targetWalletId);
        if (values.categoryId) formData.append('categoryId', values.categoryId);
        formData.append('date', values.date.toISOString());
        if (values.description) formData.append('description', values.description);

        let result;
        if (transactionId) {
            result = await updateTransaction(transactionId, formData);
        } else {
            result = await addTransaction(formData);
        }

        setLoading(false);

        if (result?.success) {
            toast.success(transactionId ? "Transaksi berhasil diperbarui" : "Transaksi berhasil disimpan");
            if (!transactionId) form.reset();
            onSuccess();
        } else {
            console.error(result?.error);
            toast.error(transactionId ? "Gagal memperbarui transaksi" : "Gagal menyimpan transaksi");
        }
    }

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipe</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="income">Pemasukan</SelectItem>
                                        <SelectItem value="expense">Pengeluaran</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jumlah</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="walletId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dompet Asal</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih dompet" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {wallets.map((wallet) => (
                                            <SelectItem key={wallet.id} value={wallet.id}>
                                                {wallet.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {type === 'transfer' && (
                        <FormField
                            control={form.control}
                            name="targetWalletId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dompet Tujuan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih dompet tujuan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wallets.map((wallet) => (
                                                <SelectItem key={wallet.id} value={wallet.id}>
                                                    {wallet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {type !== 'transfer' && (
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pilih tanggal</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi</FormLabel>
                                <FormControl>
                                    <Input placeholder="Belanja, Sewa, dll." {...field} />
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
                        {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
