'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { CommandPalette } from './command-palette';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
    return (
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-50">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="p-0 w-72 border-r border-sidebar-border">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <Sidebar />
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    <CommandPalette />
                </div>
                <ModeToggle />
            </div>
        </div>
    );
}
