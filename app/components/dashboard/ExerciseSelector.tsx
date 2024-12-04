import { useState } from 'react';
import type { Exercise } from '@/app/types/database';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedExercises: string[];
  onExerciseChange: (exerciseIds: string[]) => void;
}

export default function ExerciseSelector({ exercises, selectedExercises, onExerciseChange }: ExerciseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedExercises.length === exercises.length) {
      onExerciseChange([]);
    } else {
      onExerciseChange(exercises.map(e => e.id));
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    if (selectedExercises.includes(exerciseId)) {
      onExerciseChange(selectedExercises.filter(id => id !== exerciseId));
    } else {
      onExerciseChange([...selectedExercises, exerciseId]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex items-center justify-between w-full"
      >
        <span className="text-gray-700 dark:text-gray-300">
          {selectedExercises.length === 0
            ? 'Select exercises'
            : `${selectedExercises.length} selected`}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
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
          <div className="absolute z-20 mt-2 w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="p-2">
              <button
                onClick={handleSelectAll}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                {selectedExercises.length === exercises.length ? 'Deselect All' : 'Select All'}
              </button>
              <div className="max-h-60 overflow-auto mt-2">
                {exercises.map((exercise) => (
                  <label
                    key={exercise.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExercises.includes(exercise.id)}
                      onChange={() => handleToggleExercise(exercise.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {exercise.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}