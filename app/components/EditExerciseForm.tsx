'use client';

import { useState } from 'react';
import { updateExercise } from '../lib/api/exercises';
import type { Exercise } from '../types/database';

interface EditExerciseFormProps {
  exercise: Exercise;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditExerciseForm({ exercise, onSuccess, onCancel }: EditExerciseFormProps) {
  const [formData, setFormData] = useState({
    name: exercise.name,
    description: exercise.description || '',
    default_sets: exercise.default_sets,
    default_reps: exercise.default_reps,
    default_weight: exercise.default_weight,
    icon_url: exercise.icon_url || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateExercise(exercise.id, formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Exercise</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="icon_url"
              value={formData.icon_url}
              onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="default_sets" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Sets
              </label>
              <input
                type="number"
                id="default_sets"
                min="1"
                max="20"
                value={formData.default_sets}
                onChange={(e) => setFormData({ ...formData, default_sets: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="default_reps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Reps
              </label>
              <input
                type="number"
                id="default_reps"
                min="1"
                max="100"
                value={formData.default_reps}
                onChange={(e) => setFormData({ ...formData, default_reps: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="default_weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="default_weight"
                min="0"
                step="0.5"
                value={formData.default_weight}
                onChange={(e) => setFormData({ ...formData, default_weight: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}