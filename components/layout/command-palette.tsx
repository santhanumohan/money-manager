'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Tags,
  PieChart,
  Plus,
  Settings
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground sm:w-64 sm:pr-12 md:w-80 lg:w-96 relative"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Cari menu atau aksi...</span>
        <span className="inline-flex lg:hidden">Cari...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik perintah atau cari..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          <CommandGroup heading="Navigasi">
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/transactions'))}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <span>Transaksi</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/categories'))}>
              <Tags className="mr-2 h-4 w-4" />
              <span>Kategori</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/wallets'))}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Dompet</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/analytics'))}>
              <PieChart className="mr-2 h-4 w-4" />
              <span>Analitik</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Aksi Cepat">
            <CommandItem onSelect={() => runCommand(() => router.push('/transactions?action=new'))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Tambah Transaksi Baru</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/categories?action=new'))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Tambah Kategori Baru</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Missing icons fix
import { ArrowRightLeft, Wallet } from 'lucide-react';
