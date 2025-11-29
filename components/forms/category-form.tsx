'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCategory, updateCategory } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    type: z.enum(['income', 'expense']),
    color: z.string().optional(),
});

interface CategoryFormProps {
    onSuccess: () => void;
    defaultValues?: Partial<z.infer<typeof formSchema>>;
    categoryId?: string;
}

export function CategoryForm({ onSuccess, defaultValues, categoryId }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: defaultValues || {
            name: '',
            type: 'expense',
            color: '#000000',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('type', values.type);
        formData.append('color', values.color || '');

        let result;
        if (categoryId) {
            result = await updateCategory(categoryId, formData);
        } else {
            result = await createCategory(formData);
        }

        setLoading(false);

        if (result?.success) {
            toast.success(categoryId ? "Kategori berhasil diperbarui" : "Kategori berhasil dibuat");
            if (!categoryId) form.reset();
            onSuccess();
        } else {
            console.error(result?.error);
            toast.error(result?.error as string || "Gagal menyimpan kategori");
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
                                <Input placeholder="Makanan, Gaji, dll." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                    </SelectContent>
                                </Select>
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
                        {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
