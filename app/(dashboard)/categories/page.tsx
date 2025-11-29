import { categories } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CategoryList } from '@/components/categories/category-list';

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const userCategories = await db.query.categories.findMany({
        where: eq(categories.userId, user.id),
    });

    return <CategoryList categories={userCategories} />;
}
