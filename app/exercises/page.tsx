'use client';

import { useState, useEffect } from 'react';
import { getExercises } from '../lib/api/exercises';
import type { Exercise } from '../types/database';
import AddExerciseForm from '../components/AddExerciseForm';
import EditExerciseForm from '../components/EditExerciseForm';
import ExerciseCard from '../components/ExerciseCard';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const fetchExercises = async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleExerciseAdded = () => {
    setShowAddForm(false);
    fetchExercises();
  };

  const handleExerciseUpdated = () => {
    setEditingExercise(null);
    fetchExercises();
  };

  const handleExerciseDeleted = (deletedId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading exercises</h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exercises</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your exercise library</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium shadow-sm hover:bg-black/90 dark:hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-black transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Exercise
        </button>
      </div>
      
      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No exercises</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new exercise.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={setEditingExercise}
              onDelete={handleExerciseDeleted}
            />
          ))}
        </div>
      )}

      {showAddForm && (
        <AddExerciseForm
          onSuccess={handleExerciseAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingExercise && (
        <EditExerciseForm
          exercise={editingExercise}
          onSuccess={handleExerciseUpdated}
          onCancel={() => setEditingExercise(null)}
        />
      )}
    </div>
  );
}