'use client';

import { useState } from 'react';
import type { Exercise } from '../types/database';
import { deleteExercise } from '../lib/api/exercises';
import ConfirmDialog from './ConfirmDialog';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
}

export default function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExercise(exercise.id);
      onDelete(exercise.id);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-black rounded-md shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                {exercise.name}
              </h3>
              {exercise.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {exercise.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(exercise)}
                className="p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Edit exercise"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isDeleting}
                className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="Delete exercise"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 group-hover:bg-white dark:group-hover:bg-black transition-colors">
              <div className="text-sm text-gray-600 dark:text-gray-400">Sets</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {exercise.default_sets}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 group-hover:bg-white dark:group-hover:bg-black transition-colors">
              <div className="text-sm text-gray-600 dark:text-gray-400">Reps</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {exercise.default_reps}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 group-hover:bg-white dark:group-hover:bg-black transition-colors">
              <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {exercise.default_weight}<span className="text-sm ml-1">kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Exercise"
        message={`Are you sure you want to delete "${exercise.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}