import { supabase } from '../supabase';
import type { Workout } from '@/app/types/database';

export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createWorkout(name: string): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateWorkout(id: string, name: string): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}