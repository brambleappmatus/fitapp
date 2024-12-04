'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Exercise } from '../types/database';

interface SortableExerciseProps {
  id: string;
  exercise: Exercise;
  onRemove: () => void;
}

export default function SortableExercise({ id, exercise, onRemove }: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: '48px', // Fixed height to prevent stretching
    touchAction: 'none' // Prevent touch scrolling while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-3 bg-white border rounded-lg mb-2 group hover:border-gray-300 text-gray-900"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <svg 
            className="w-5 h-5 text-gray-400 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="font-medium select-none">{exercise.name}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="Remove exercise"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}