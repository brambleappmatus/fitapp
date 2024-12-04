'use client';

import { useState, useEffect } from 'react';
import { getWorkouts } from '../lib/api/workouts';
import type { Workout } from '../types/database';

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading workouts...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Workouts</h2>
      {workouts.length === 0 ? (
        <p className="text-gray-500">No workouts found. Start by creating one!</p>
      ) : (
        <ul className="space-y-2">
          {workouts.map((workout) => (
            <li
              key={workout.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{workout.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(workout.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}