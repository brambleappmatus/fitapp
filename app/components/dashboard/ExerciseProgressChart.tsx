'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import type { Exercise } from '@/app/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';

const COLORS = [
  '#059669', // Emerald-600 for first exercise
  '#2563EB', // Blue-600
  '#D97706', // Amber-600
  '#DC2626', // Red-600
  '#7C3AED', // Violet-600
  '#DB2777', // Pink-600
  '#2DD4BF', // Teal-400
  '#F59E0B', // Amber-500
  '#4F46E5', // Indigo-600
  '#EC4899'  // Pink-500
];

interface ChartData {
  date: string;
  [key: string]: number | string;
}

interface ExerciseProgressChartProps {
  data: ChartData[];
  exercises: Exercise[];
}

export default function ExerciseProgressChart({ data, exercises }: ExerciseProgressChartProps) {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleSelectAll = () => {
    if (selectedExercises.length === exercises.length) {
      setSelectedExercises([]);
    } else {
      setSelectedExercises(exercises.map(e => e.id));
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(prev => prev.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises(prev => [...prev, exerciseId]);
    }
  };

  const getExerciseColor = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  return (
    <div className="bg-white dark:bg-black rounded-md p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercise Progress</h3>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent flex items-center justify-between gap-2 min-w-[200px]"
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
                <div className="absolute z-20 mt-2 w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md shadow-sm">
                  <div className="p-2">
                    <button
                      onClick={handleSelectAll}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md"
                    >
                      {selectedExercises.length === exercises.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <div className="max-h-60 overflow-auto mt-2">
                      {exercises.map((exercise, index) => (
                        <label
                          key={exercise.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-md"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExercises.includes(exercise.id)}
                            onChange={() => handleToggleExercise(exercise.id)}
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:text-white dark:focus:ring-white"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {exercise.name}
                          </span>
                          <div 
                            className="ml-2 w-3 h-3 rounded-full"
                            style={{ backgroundColor: getExerciseColor(index) }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `${value}kg`}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  color: theme === 'dark' ? '#F3F4F6' : '#111827',
                  padding: '12px'
                }}
                labelFormatter={(value) => format(new Date(value), 'PPP')}
              />
              <Legend />
              {selectedExercises.map((exerciseId, index) => {
                const exercise = exercises.find(e => e.id === exerciseId);
                if (!exercise) return null;

                return (
                  <Line
                    key={exerciseId}
                    type="monotone"
                    dataKey={exerciseId}
                    name={exercise.name}
                    stroke={getExerciseColor(index)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}