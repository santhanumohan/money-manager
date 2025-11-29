import { wallets } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WalletsList } from '@/components/wallets/wallet-list';

export default async function WalletsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const userWallets = await db.query.wallets.findMany({
        where: eq(wallets.userId, user.id),
    });

    return <WalletsList wallets={userWallets} />;
}
