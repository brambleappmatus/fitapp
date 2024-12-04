'use client';

import { useState } from 'react';

interface FinishWorkoutDialogProps {
  isOpen: boolean;
  onConfirm: (score: number) => void;
  onCancel: () => void;
}

export default function FinishWorkoutDialog({
  isOpen,
  onConfirm,
  onCancel
}: FinishWorkoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number>(3);

  if (!isOpen) return null;

  const emojis = ['😫', '😕', '😐', '🙂', '🤩'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(selectedScore);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg rounded-lg w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How was your workout?</h2>
          
          <div className="flex justify-between items-center px-4">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedScore(index + 1)}
                className={`text-4xl transition-transform ${
                  selectedScore === index + 1 
                    ? 'transform scale-125' 
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}