'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CategoryForm } from '@/components/forms/category-form';
import { Category } from '@/types/data';

interface EditCategoryDialogProps {
    category: Category;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                    <DialogDescription>
                        Update your category details here.
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm
                    onSuccess={() => onOpenChange(false)}
                    defaultValues={{
                        name: category.name,
                        type: category.type,
                        color: category.color || '#000000',
                    }}
                    categoryId={category.id}
                />
            </DialogContent>
        </Dialog>
    );
}
