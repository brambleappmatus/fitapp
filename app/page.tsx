'use client';

import { useState, useEffect } from 'react';
import TimeFrameSelector from './components/dashboard/TimeFrameSelector';
import PerformanceChart from './components/dashboard/PerformanceChart';
import ExerciseProgressChart from './components/dashboard/ExerciseProgressChart';
import StatsGrid from './components/dashboard/StatsGrid';
import RecentActivity from './components/dashboard/RecentActivity';
import { getDashboardStats } from './lib/api/dashboard';
import { useDateRange } from './hooks/useDateRange';

export default function Home() {
  const { dateRange, updateDateRange } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const data = await getDashboardStats(
          'custom',
          dateRange.startDate,
          dateRange.endDate
        );
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [dateRange]);

  const handleTimeFrameChange = (startDate: Date, endDate: Date) => {
    updateDateRange({ startDate, endDate });
  };

  const stats = [
    {
      label: 'Total Workouts',
      value: dashboardData?.totalWorkouts || 0,
      change: dashboardData?.workoutChange,
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      label: 'Total Weight',
      value: `${dashboardData?.totalWeight || 0}kg`,
      change: dashboardData?.weightChange,
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h2m10 0h2M8 8h6M4 12h14M4 16h2m10 0h2M8 16h6" />
        </svg>
      )
    },
    {
      label: 'Avg. Score',
      value: dashboardData?.avgScore?.toFixed(1) || '0.0',
      change: dashboardData?.scoreChange,
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track your fitness progress and achievements</p>
        </div>
        <TimeFrameSelector 
          onTimeFrameChange={handleTimeFrameChange}
        />
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading dashboard</h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart 
                data={dashboardData?.performanceData || []}
              />
            </div>
            <div className="bg-white dark:bg-black rounded-md p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <RecentActivity activities={dashboardData?.recentActivity || []} />
            </div>
          </div>

          <ExerciseProgressChart
            data={dashboardData?.exerciseProgressData || []}
            exercises={dashboardData?.exercises || []}
          />
        </>
      )}
    </div>
  );
}