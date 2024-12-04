import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import { ThemeProvider } from './providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workout Tracker',
  description: 'Track your workouts and exercises',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-black text-gray-900 dark:text-white transition-theme`}>
        <ThemeProvider>
          <FloatingThemeToggle />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 transition-all duration-300 ease-in-out">
              <div className="container-fluid p-4 sm:p-6 lg:p-8 lg:mt-0 mb-20 lg:mb-0">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}