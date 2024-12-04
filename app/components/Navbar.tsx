'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">Workout Tracker</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/exercises"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/exercises')}`}
                >
                  Exercises
                </Link>
                <Link
                  href="/workouts"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/workouts')}`}
                >
                  Workouts
                </Link>
                <Link
                  href="/log"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/log')}`}
                >
                  Log Workout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}