'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { updateWorkout } from '../lib/api/workouts';
import { getWorkoutExercises, addExerciseToWorkout, removeExerciseFromWorkout, updateExercisesOrder } from '../lib/api/workout-exercises';
import { getExercises } from '../lib/api/exercises';
import type { Workout, Exercise, WorkoutExercise } from '../types/database';
import SortableExercise from './SortableExercise';

interface EditWorkoutModalProps {
  workout: Workout;
  onSuccess: (workout: Workout) => void;
  onCancel: () => void;
}

export default function EditWorkoutModal({ workout, onSuccess, onCancel }: EditWorkoutModalProps) {
  const [name, setName] = useState(workout.name);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [workoutExercises, allExercises] = await Promise.all([
          getWorkoutExercises(workout.id),
          getExercises()
        ]);

        setSelectedExercises(workoutExercises);

        // Filter out exercises that are already in the workout
        const selectedIds = new Set(workoutExercises.map(we => we.exercise_id));
        setAvailableExercises(allExercises.filter(exercise => !selectedIds.has(exercise.id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workout details');
      } finally {
        setInitialLoad(false);
      }
    }

    fetchData();
  }, [workout.id]);

  const handleExerciseSelect = async (exerciseId: string) => {
    const exercise = availableExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    try {
      const workoutExercise = await addExerciseToWorkout({
        workout_id: workout.id,
        exercise_id: exercise.id,
        sets: exercise.default_sets,
        reps: exercise.default_reps,
        weight: exercise.default_weight
      });

      setSelectedExercises(prev => [...prev, workoutExercise]);
      setAvailableExercises(prev => prev.filter(e => e.id !== exerciseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add exercise');
    }
  };

  const handleExerciseRemove = async (workoutExerciseId: string) => {
    const workoutExercise = selectedExercises.find(we => we.id === workoutExerciseId);
    if (!workoutExercise?.exercise) return;

    try {
      await removeExerciseFromWorkout(workoutExerciseId);
      setSelectedExercises(prev => prev.filter(we => we.id !== workoutExerciseId));
      setAvailableExercises(prev => [...prev, workoutExercise.exercise!].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove exercise');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = selectedExercises.findIndex(item => item.id === active.id);
      const newIndex = selectedExercises.findIndex(item => item.id === over.id);
      
      const newOrder = arrayMove(selectedExercises, oldIndex, newIndex);
      setSelectedExercises(newOrder);

      try {
        await updateExercisesOrder(
          workout.id,
          newOrder.map(exercise => exercise.id)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update exercise order');
        // Revert the order if the update fails
        setSelectedExercises(selectedExercises);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updatedWorkout = await updateWorkout(workout.id, name);
      onSuccess(updatedWorkout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Workout</h2>
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
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-900"
                    onClick={() => handleExerciseSelect(exercise.id)}
                  >
                    <span>{exercise.name}</span>
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
                    {selectedExercises.map((workoutExercise) => (
                      <SortableExercise
                        key={workoutExercise.id}
                        id={workoutExercise.id}
                        exercise={workoutExercise.exercise!}
                        onRemove={() => handleExerciseRemove(workoutExercise.id)}
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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}