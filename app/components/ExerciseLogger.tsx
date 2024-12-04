'use client';

import { useState, useEffect } from 'react';
import { updateWorkoutExercise } from '../lib/api/workout-exercises';
import type { WorkoutExercise } from '../types/database';

interface ExerciseLoggerProps {
  workoutExercises: WorkoutExercise[];
  onError: (error: string | null) => void;
  onExerciseUpdate: (exercises: WorkoutExercise[]) => void;
}

export default function ExerciseLogger({ workoutExercises, onError, onExerciseUpdate }: ExerciseLoggerProps) {
  const [exerciseData, setExerciseData] = useState<Record<string, {
    sets: number;
    reps: number;
    weight: number;
    previousWeight?: number;
    lastUsedAt?: string;
    isUpdated: boolean;
  }>>({});

  useEffect(() => {
    const initialData = Object.fromEntries(
      workoutExercises.map(workoutExercise => [
        workoutExercise.id,
        {
          sets: workoutExercise.sets || workoutExercise.exercise?.default_sets || 3,
          reps: workoutExercise.reps || workoutExercise.exercise?.default_reps || 10,
          weight: workoutExercise.weight || workoutExercise.exercise?.default_weight || 20,
          previousWeight: workoutExercise.previous_weight,
          lastUsedAt: workoutExercise.last_used_at,
          isUpdated: false
        }
      ])
    );
    setExerciseData(initialData);
  }, [workoutExercises]);

  useEffect(() => {
    const updatedExercises = workoutExercises.map(exercise => ({
      ...exercise,
      sets: exerciseData[exercise.id]?.sets || exercise.sets,
      reps: exerciseData[exercise.id]?.reps || exercise.reps,
      weight: exerciseData[exercise.id]?.weight || exercise.weight
    }));
    onExerciseUpdate(updatedExercises);
  }, [exerciseData, workoutExercises, onExerciseUpdate]);

  const handleUpdate = async (exerciseId: string) => {
    try {
      const data = exerciseData[exerciseId];
      await updateWorkoutExercise(exerciseId, {
        sets: data.sets,
        reps: data.reps,
        weight: data.weight
      });
      
      setExerciseData(prev => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          isUpdated: true,
          previousWeight: data.weight,
          lastUsedAt: new Date().toISOString()
        }
      }));
      
      onError(null);

      setTimeout(() => {
        setExerciseData(prev => ({
          ...prev,
          [exerciseId]: {
            ...prev[exerciseId],
            isUpdated: false
          }
        }));
      }, 2000);
    } catch (err) {
      onError('Failed to update exercise');
    }
  };

  const calculateSuggestedWeight = (currentWeight: number | undefined): number => {
    if (typeof currentWeight !== 'number') return 0;
    return Math.round((currentWeight + 2.5) * 2) / 2;
  };

  return (
    <div className="space-y-4">
      {workoutExercises.map((workoutExercise) => (
        <div 
          key={workoutExercise.id} 
          className="group bg-gray-50 dark:bg-gray-900/50 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {workoutExercise.exercise?.name}
              </h3>
              <button
                onClick={() => handleUpdate(workoutExercise.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exerciseData[workoutExercise.id]?.isUpdated
                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {exerciseData[workoutExercise.id]?.isUpdated ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                ) : 'Save'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  value={exerciseData[workoutExercise.id]?.sets ?? ''}
                  onChange={(e) => setExerciseData(prev => ({
                    ...prev,
                    [workoutExercise.id]: {
                      ...prev[workoutExercise.id],
                      sets: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  value={exerciseData[workoutExercise.id]?.reps ?? ''}
                  onChange={(e) => setExerciseData(prev => ({
                    ...prev,
                    [workoutExercise.id]: {
                      ...prev[workoutExercise.id],
                      reps: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={exerciseData[workoutExercise.id]?.weight ?? ''}
                  onChange={(e) => setExerciseData(prev => ({
                    ...prev,
                    [workoutExercise.id]: {
                      ...prev[workoutExercise.id],
                      weight: parseFloat(e.target.value) || 0
                    }
                  }))}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
                />
              </div>
            </div>

            {exerciseData[workoutExercise.id]?.previousWeight && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  Previous: {exerciseData[workoutExercise.id].previousWeight}kg
                  {exerciseData[workoutExercise.id].lastUsedAt && (
                    <span className="ml-1 text-gray-500">
                      ({new Date(exerciseData[workoutExercise.id].lastUsedAt!).toLocaleDateString()})
                    </span>
                  )}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Suggested: {calculateSuggestedWeight(exerciseData[workoutExercise.id].previousWeight)}kg
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}