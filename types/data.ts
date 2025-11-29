export interface Wallet {
    id: string;
    name: string;
    balance: number | string;
    color?: string | null;
    userId: string;
}

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color?: string | null;
    userId: string;
}

export interface Transaction {
    id: string;
    amount: number | string;
    type: 'income' | 'expense' | 'transfer';
    date: Date;
    description?: string | null;
    userId: string;
    walletId: string;
    targetWalletId?: string | null;
    categoryId?: string | null;
    category?: { name: string } | null;
    wallet: { name: string };
    targetWallet?: { name: string } | null;
}

export interface Budget {
    id: string;
    amount: number | string;
    period: string;
    categoryId: string;
    category: { name: string };
    spent?: number;
}
