export interface Exercise {
  id: string;
  name: string;
  description?: string;
  default_sets: number;
  default_reps: number;
  default_weight: number;
  icon_url?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  name: string;
  created_at: string;
}

export interface ArchivedWorkout {
  id: string;
  workout_template_id: string | null;
  name: string;
  notes?: string;
  date: string;
  score?: number;
}

export interface WorkoutExercise {
  id: string;
  workout_id?: string;
  archived_workout_id?: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number;
  created_at: string;
  previous_weight?: number;
  last_used_at?: string;
  exercise?: Exercise;
}