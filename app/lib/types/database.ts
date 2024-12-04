export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  date: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  icon_url?: string;
}