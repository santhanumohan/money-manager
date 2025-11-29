'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Wallet, ArrowRightLeft, LogOut, Tags, PieChart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
        color: 'text-sky-500',
    },
    {
        label: 'Dompet',
        icon: Wallet,
        href: '/wallets',
        color: 'text-violet-500',
    },
    {
        label: 'Transaksi',
        icon: ArrowRightLeft,
        href: '/transactions',
        color: 'text-pink-700',
    },
    {
        label: 'Kategori',
        icon: Tags,
        href: '/categories',
        color: 'text-emerald-500',
    },
    {
        label: 'Analitik',
        icon: PieChart,
        href: '/analytics',
        color: 'text-orange-500',
    },
    {
        label: 'Pengaturan',
        icon: Settings,
        href: '/settings',
        color: 'text-gray-500',
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14 gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold">Money Manager</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition',
                                pathname === route.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground'
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <form action={logout}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <LogOut className="h-5 w-5 mr-3" />
                        Keluar
                    </Button>
                </form>
            </div>
        </div>
    );
}
