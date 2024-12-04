'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, DumbbellIcon, ClipboardIcon, HistoryIcon } from './icons';

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400';
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/workouts', label: 'Workouts', icon: ClipboardIcon },
    { path: '/exercises', label: 'Exercises', icon: DumbbellIcon },
    { path: '/log', label: 'Log', icon: ClipboardIcon },
    { path: '/history', label: 'History', icon: HistoryIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pb-safe-area">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${isActive(item.path)}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}