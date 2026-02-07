'use client';

import { useState } from 'react';
import { seedCategories } from '@/actions/categories';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function SeedCategoriesButton() {
    const [loading, setLoading] = useState(false);

    async function handleSeed() {
        setLoading(true);
        try {
            await seedCategories();
            toast.success("Default categories added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add categories");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleSeed} disabled={loading}>
            {loading ? 'Processing...' : 'Seed default categories'}
        </Button>
    );
}
