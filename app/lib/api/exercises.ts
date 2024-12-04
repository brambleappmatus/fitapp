import { supabase } from '../supabase';
import type { Exercise } from '@/app/types/database';

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createExercise(exercise: Pick<Exercise, 'name' | 'description' | 'default_sets' | 'default_reps' | 'default_weight'>): Promise<Exercise> {
  // First check if an exercise with this name already exists
  const { data: existingExercise } = await supabase
    .from('exercises')
    .select('id')
    .ilike('name', exercise.name)
    .single();

  if (existingExercise) {
    throw new Error('An exercise with this name already exists');
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert([exercise])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // PostgreSQL unique violation error code
      throw new Error('An exercise with this name already exists');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function updateExercise(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
  // If name is being updated, check for duplicates
  if (exercise.name) {
    const { data: existingExercise } = await supabase
      .from('exercises')
      .select('id')
      .ilike('name', exercise.name)
      .neq('id', id) // Exclude current exercise from check
      .single();

    if (existingExercise) {
      throw new Error('An exercise with this name already exists');
    }
  }

  const { data, error } = await supabase
    .from('exercises')
    .update(exercise)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // PostgreSQL unique violation error code
      throw new Error('An exercise with this name already exists');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function deleteExercise(id: string): Promise<void> {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}