'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function MonthFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentPeriod = searchParams.get('period') || format(new Date(), 'yyyy-MM');
    const date = new Date(`${currentPeriod}-01`);

    const handlePrevMonth = () => {
        const newDate = subMonths(date, 1);
        const params = new URLSearchParams(searchParams);
        params.set('period', format(newDate, 'yyyy-MM'));
        replace(`${pathname}?${params.toString()}`);
    };

    const handleNextMonth = () => {
        const newDate = addMonths(date, 1);
        const params = new URLSearchParams(searchParams);
        params.set('period', format(newDate, 'yyyy-MM'));
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-40 text-center font-medium border rounded-md py-2 bg-background">
                {format(date, 'MMMM yyyy', { locale: enUS })}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={format(addMonths(date, 1), 'yyyy-MM') > format(new Date(), 'yyyy-MM')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
