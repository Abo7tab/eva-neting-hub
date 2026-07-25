"use client";

import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/shared/components/ui/sheet';
import { Sidebar } from './sidebar';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 w-72 border-l">
        <SheetHeader className="sr-only">
          <SheetTitle>القائمة الجانبية</SheetTitle>
        </SheetHeader>
        <Sidebar onItemClick={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
