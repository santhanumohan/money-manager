'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { X } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export function TransactionFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Initialize date state from URL params
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const initialDate: DateRange | undefined = fromParam ? {
        from: new Date(fromParam),
        to: toParam ? new Date(toParam) : undefined
    } : undefined;

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set('type', value);
        } else {
            params.delete('type');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleDateChange = (date: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams);
        if (date?.from) {
            params.set('from', format(date.from, 'yyyy-MM-dd'));
            if (date.to) {
                params.set('to', format(date.to, 'yyyy-MM-dd'));
            } else {
                params.delete('to');
            }
        } else {
            params.delete('from');
            params.delete('to');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        replace(pathname);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <Input
                placeholder="Search description..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
                className="lg:w-1/3"
            />
            <div className="flex flex-col sm:flex-row gap-4">
                <Select
                    defaultValue={searchParams.get('type')?.toString() || "all"}
                    onValueChange={handleTypeChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                </Select>
                <DatePickerWithRange 
                    date={initialDate}
                    setDate={handleDateChange}
                    className="w-full sm:w-auto"
                />
            </div>
            {(searchParams.get('query') || searchParams.get('type') || searchParams.get('from')) && (
                <Button variant="ghost" onClick={handleClear} size="icon" className="shrink-0">
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
