"use client";

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopHeader } from './top-header';
import { MobileSidebar } from './mobile-sidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Desktop Sidebar - Right side for RTL */}
      <aside className="hidden lg:flex fixed top-0 right-0 z-40 h-screen w-72 flex-col bg-white border-l border-slate-200 shadow-sm">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />

      {/* Main Content Area - offset by sidebar width on desktop */}
      <div className="lg:mr-72 min-h-screen flex flex-col overflow-x-hidden">
        {/* Sticky Top Header */}
        <TopHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
