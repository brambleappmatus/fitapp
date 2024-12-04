'use client';

import { useState } from 'react';
import type { Workout } from '../types/database';

interface WorkoutSelectorProps {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  onSelect: (workout: Workout | null) => void;
}

export default function WorkoutSelector({ workouts, selectedWorkout, onSelect }: WorkoutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center">
          {selectedWorkout ? (
            <>
              <span className="text-gray-900 dark:text-white font-medium">{selectedWorkout.name}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(selectedWorkout.date).toLocaleDateString()}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Select a workout</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-auto">
              {workouts.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No workouts available
                </div>
              ) : (
                workouts.map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => {
                      onSelect(workout);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                      selectedWorkout?.id === workout.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {workout.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(workout.date).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}