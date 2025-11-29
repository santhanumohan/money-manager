'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateCategoryDialog } from '@/components/categories/create-category-dialog';
import { EditCategoryDialog } from '@/components/categories/edit-category-dialog';
import { MoreHorizontal, Pencil, Trash, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
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
import { deleteCategory } from '@/actions/categories';
import { toast } from 'sonner';
import { Category } from '@/types/data';
import { cn } from '@/lib/utils';

interface CategoryListProps {
    categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const result = await deleteCategory(id);
        if (result.success) {
            toast.success("Kategori berhasil dihapus");
            setDeletingId(null);
        } else {
            toast.error(result.error as string);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Kategori</h2>
                <CreateCategoryDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id} style={{ borderLeft: `4px solid ${category.color || '#000'}` }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <div className={cn("p-1.5 rounded-full", 
                                    category.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    {category.type === 'income' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                                </div>
                                {category.name}
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
                                    <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(category.id)}>
                                        <Trash className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground capitalize">
                                {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        Belum ada kategori. Buat satu untuk memulai.
                    </div>
                )}
            </div>

            {editingCategory && (
                <EditCategoryDialog
                    category={editingCategory}
                    open={!!editingCategory}
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                />
            )}

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. 
                            <br/><br/>
                            <span className="text-red-500 font-bold">Peringatan:</span> Penghapusan akan gagal jika kategori ini masih digunakan oleh transaksi atau anggaran aktif.
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
        </div>
    );
}
