'use client';

import { useState } from 'react';
import { deleteWorkout } from '../lib/api/workouts';
import type { Workout } from '../types/database';
import ConfirmDialog from './ConfirmDialog';

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (id: string) => void;
  onEdit: (workout: Workout) => void;
}

export default function WorkoutCard({ workout, onDelete, onEdit }: WorkoutCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkout(workout.id);
      onDelete(workout.id);
    } catch (error) {
      console.error('Failed to delete workout:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-black rounded-md shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                {workout.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(workout.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(workout)}
                className="p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Edit workout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="Delete workout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Workout"
        message={`Are you sure you want to delete "${workout.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}