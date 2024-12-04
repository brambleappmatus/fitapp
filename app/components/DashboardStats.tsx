'use client';

import { useState, useEffect } from 'react';
import { getWorkouts } from '../lib/api/workouts';
import type { Workout } from '../types/database';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    recentWorkouts: [] as Workout[]
  });

  useEffect(() => {
    async function fetchStats() {
      const workouts = await getWorkouts();
      setStats({
        totalWorkouts: workouts.length,
        recentWorkouts: workouts.slice(0, 5)
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Quick Stats</h3>
        <p className="text-gray-600">Total Workouts: {stats.totalWorkouts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Recent Workouts</h3>
        <ul className="space-y-2">
          {stats.recentWorkouts.map((workout) => (
            <li key={workout.id} className="text-gray-600">
              {workout.name} - {new Date(workout.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}