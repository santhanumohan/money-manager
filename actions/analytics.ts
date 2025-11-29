'use server';

import { db } from '@/db';
import { transactions, budgets, categories } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, and, sql, gte, lte } from 'drizzle-orm';
import { format, subMonths, startOfMonth, endOfMonth, parse } from 'date-fns';

export async function getSixMonthHistory() {
    // ... existing code ...
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const endDate = new Date();
    const startDate = subMonths(endDate, 5); // Current month + previous 5 months = 6 months
    
    const startDateObj = startOfMonth(startDate);
    const endDateObj = endOfMonth(endDate);

    // 1. Fetch Monthly Spending
    const spendingData = await db
        .select({
            month: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`,
            amount: sql<number>`sum(${transactions.amount})`
        })
        .from(transactions)
        .where(and(
            eq(transactions.userId, user.id),
            eq(transactions.type, 'expense'),
            gte(transactions.date, startDateObj),
            lte(transactions.date, endDateObj)
        ))
        .groupBy(sql`to_char(${transactions.date}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${transactions.date}, 'YYYY-MM')`);

    // 2. Fetch Monthly Budgets
    // Note: Budget period is already stored as 'YYYY-MM' text
    const startPeriod = format(startDate, 'yyyy-MM');
    const endPeriod = format(endDate, 'yyyy-MM');

    const budgetData = await db
        .select({
            month: budgets.period,
            amount: sql<number>`sum(${budgets.amount})`
        })
        .from(budgets)
        .where(and(
            eq(budgets.userId, user.id),
            gte(budgets.period, startPeriod),
            lte(budgets.period, endPeriod)
        ))
        .groupBy(budgets.period)
        .orderBy(budgets.period);

    // 3. Merge Data
    // Create a map for the last 6 months
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthKey = format(date, 'yyyy-MM');
        const monthName = format(date, 'MMM'); // e.g., "Nov"

        const spending = spendingData.find(d => d.month === monthKey);
        const budget = budgetData.find(d => d.month === monthKey);

        result.push({
            month: monthName,
            fullMonth: monthKey,
            spending: Number(spending?.amount || 0),
            budget: Number(budget?.amount || 0),
        });
    }

    return result;
}

export async function getCategoryBreakdown(period: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    // Parse period (YYYY-MM) to Start/End Dates
    const date = parse(period, 'yyyy-MM', new Date());
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    // Fetch expenses grouped by category
    const categoryExpenses = await db
        .select({
            categoryId: transactions.categoryId,
            categoryName: categories.name,
            categoryColor: categories.color,
            amount: sql<number>`sum(${transactions.amount})`
        })
        .from(transactions)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(and(
            eq(transactions.userId, user.id),
            eq(transactions.type, 'expense'),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
        ))
        .groupBy(transactions.categoryId, categories.name, categories.color)
        .orderBy(sql`sum(${transactions.amount}) DESC`);

    // Format for chart
    return categoryExpenses.map(item => ({
        name: item.categoryName || 'Tanpa Kategori',
        value: Number(item.amount),
        color: item.categoryColor || '#94a3b8', // default slate-400
    }));
}

export async function getPeriodSummary(period: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { income: 0, expense: 0, savings: 0 };
    }

    const date = parse(period, 'yyyy-MM', new Date());
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const summary = await db
        .select({
            type: transactions.type,
            amount: sql<number>`sum(${transactions.amount})`
        })
        .from(transactions)
        .where(and(
            eq(transactions.userId, user.id),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
        ))
        .groupBy(transactions.type);

    let income = 0;
    let expense = 0;

    summary.forEach(item => {
        if (item.type === 'income') income = Number(item.amount);
        if (item.type === 'expense') expense = Number(item.amount);
    });

    return {
        income,
        expense,
        savings: income - expense
    };
}

