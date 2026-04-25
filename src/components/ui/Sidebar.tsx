'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  bottomItems?: NavItem[];
  logo?: React.ReactNode;
}

export function Sidebar({ items, bottomItems, logo }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[rgba(8,16,32,0.95)] border-r border-[rgba(148,163,184,0.1)] backdrop-blur-xl z-40 flex flex-col">
      <div className="p-6">
        {logo || (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7cdbff] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-lg font-bold text-[#07111f]">L</span>
            </div>
            <span className="text-xl font-bold text-white">Looca</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-[rgba(124,219,255,0.15)] to-[rgba(139,92,246,0.15)] text-white border border-[rgba(124,219,255,0.3)]'
                  : 'text-[#a7b4c8] hover:bg-white/5 hover:text-white'
              )}
            >
              <span className={cn('transition-colors', isActive ? 'text-[#7cdbff]' : '')}>
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-gradient-to-b from-[#7cdbff] to-[#8b5cf6] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {bottomItems && (
        <div className="p-4 border-t border-[rgba(148,163,184,0.1)]">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#a7b4c8] hover:bg-white/5 hover:text-white transition-all"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
