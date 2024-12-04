'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { createWorkout } from '../lib/api/workouts';
import { addExerciseToWorkout } from '../lib/api/workout-exercises';
import type { Exercise, Workout } from '../types/database';
import SortableExercise from './SortableExercise';

interface NewWorkoutModalProps {
  exercises: Exercise[];
  onSuccess: (workout: Workout) => void;
  onCancel: () => void;
}

export default function NewWorkoutModal({ exercises, onSuccess, onCancel }: NewWorkoutModalProps) {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState(exercises);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExerciseSelect = (exerciseId: string) => {
    const exercise = availableExercises.find(e => e.id === exerciseId);
    if (exercise) {
      setSelectedExercises([...selectedExercises, exercise]);
      setAvailableExercises(availableExercises.filter(e => e.id !== exerciseId));
    }
  };

  const handleExerciseRemove = (exerciseId: string) => {
    const exercise = selectedExercises.find(e => e.id === exerciseId);
    if (exercise) {
      setAvailableExercises([...availableExercises, exercise]);
      setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const workout = await createWorkout(name);

      await Promise.all(
        selectedExercises.map((exercise, index) =>
          addExerciseToWorkout({
            workout_id: workout.id,
            exercise_id: exercise.id,
            sets: exercise.default_sets,
            reps: exercise.default_reps,
            weight: exercise.default_weight
          })
        )
      );

      onSuccess(workout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create New Workout</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Available Exercises</h3>
              <div className="border rounded-lg p-4 h-96 overflow-y-auto">
                {availableExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleExerciseSelect(exercise.id)}
                  >
                    <span className="text-gray-900">{exercise.name}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Exercises</h3>
              <div className="border rounded-lg p-4 h-96 overflow-y-auto">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedExercises}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedExercises.map((exercise) => (
                      <SortableExercise
                        key={exercise.id}
                        exercise={exercise}
                        onRemove={() => handleExerciseRemove(exercise.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedExercises.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? 'Creating...' : 'Create Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}