'use client';

// Suppress defaultProps warning from recharts
const originalConsoleError = console.error;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('defaultProps')) {
        return;
    }
    originalConsoleError(...args);
};

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils";

interface BudgetHistoryChartProps {
    data: {
        month: string;
        fullMonth: string;
        spending: number;
        budget: number;
    }[];
}

export function BudgetHistoryChart({ data }: BudgetHistoryChartProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Spending vs Budget (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelStyle={{ color: '#333' }}
                            contentStyle={{ borderRadius: '8px' }}
                        />
                        <Legend />
                        <Bar
                            dataKey="budget"
                            name="Budget"
                            fill="#31b848ff"
                            radius={[4, 4, 0, 0]}
                            opacity={0.3}
                        />
                        <Bar
                            dataKey="spending"
                            name="Spending"
                            fill="#c23c3cff"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
