'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportTransactionsToCSV } from '@/actions/export';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function ExportButton() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    const handleExport = async () => {
        setLoading(true);
        const query = searchParams.get('query') || undefined;
        const type = searchParams.get('type') || undefined;
        const from = searchParams.get('from') || undefined;
        const to = searchParams.get('to') || undefined;

        const result = await exportTransactionsToCSV(query, type, from, to);

        if (result.success && result.csv) {
            // Create blob and download
            const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transaksi_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Data berhasil diekspor');
        } else {
            toast.error(result.error || 'Gagal mengekspor data');
        }
        setLoading(false);
    };

    return (
        <Button variant="outline" onClick={handleExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Mengekspor...' : 'Export CSV'}
        </Button>
    );
}
