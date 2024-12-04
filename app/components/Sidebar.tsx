'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HomeIcon, DumbbellIcon, ClipboardIcon, HistoryIcon } from './icons';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-emerald-600 text-white dark:text-white' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900';
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/workouts', label: 'Workouts', icon: ClipboardIcon },
    { path: '/exercises', label: 'Exercises', icon: DumbbellIcon },
    { path: '/log', label: 'Log Workout', icon: ClipboardIcon },
    { path: '/history', label: 'History', icon: HistoryIcon },
  ];

  return (
    <aside className={`
      hidden lg:block sticky top-0 h-screen bg-white dark:bg-black shadow-sm border-r border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-[4.5rem]' : 'w-64'}
    `}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`
          overflow-hidden whitespace-nowrap transition-all duration-300
          ${isCollapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}
        `}>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Gym</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l-7 7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <nav className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="space-y-1 px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 rounded-md px-3 py-2.5
                transition-all duration-300 ease-in-out
                ${isActive(item.path)}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`
                whitespace-nowrap transition-all duration-300
                ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
              `}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}