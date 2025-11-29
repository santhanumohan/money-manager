import { pgTable, uuid, text, numeric, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense', 'transfer']);

// Tables
export const wallets = pgTable('wallets', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(), // References auth.users
    name: text('name').notNull(),
    balance: numeric('balance', { precision: 12, scale: 2 }).default('0').notNull(),
    color: text('color'),
}, (table) => ({
    userIdIdx: index('wallets_user_id_idx').on(table.userId),
}));

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    type: categoryTypeEnum('type').notNull(),
    color: text('color'),
}, (table) => ({
    userIdIdx: index('categories_user_id_idx').on(table.userId),
}));

export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    walletId: uuid('wallet_id').references(() => wallets.id, { onDelete: 'cascade' }).notNull(),
    targetWalletId: uuid('target_wallet_id').references(() => wallets.id, { onDelete: 'set null' }), // Nullable, only for transfers
    categoryId: uuid('category_id').references(() => categories.id), // Nullable
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    date: timestamp('date').defaultNow().notNull(),
    description: text('description'),
}, (table) => ({
    userIdIdx: index('transactions_user_id_idx').on(table.userId),
    walletIdIdx: index('transactions_wallet_id_idx').on(table.walletId),
    categoryIdIdx: index('transactions_category_id_idx').on(table.categoryId),
    dateIdx: index('transactions_date_idx').on(table.date),
}));

export const budgets = pgTable('budgets', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    period: text('period').notNull(), // Format: YYYY-MM
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('budgets_user_id_idx').on(table.userId),
    categoryIdIdx: index('budgets_category_id_idx').on(table.categoryId),
    periodIdx: index('budgets_period_idx').on(table.period),
    uniqueBudget: index('budgets_user_category_period_unique').on(table.userId, table.categoryId, table.period),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
    category: one(categories, {
        fields: [budgets.categoryId],
        references: [categories.id],
    }),
}));

// Relations
export const walletsRelations = relations(wallets, ({ many }) => ({
    transactions: many(transactions, { relationName: 'wallet_transactions' }),
    incomingTransfers: many(transactions, { relationName: 'target_wallet_transactions' }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    wallet: one(wallets, {
        fields: [transactions.walletId],
        references: [wallets.id],
        relationName: 'wallet_transactions',
    }),
    targetWallet: one(wallets, {
        fields: [transactions.targetWalletId],
        references: [wallets.id],
        relationName: 'target_wallet_transactions',
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));
