import { supabase } from '../supabase';
import type { WorkoutExercise } from '@/app/types/database';

export async function getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
  const { data: workoutExercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select(`
      *,
      exercise:exercises(*)
    `)
    .eq('workout_id', workoutId)
    .order('order_index', { ascending: true });

  if (exercisesError) {
    throw new Error(exercisesError.message);
  }

  // For each exercise, get the most recent archived workout data
  const exercisesWithHistory = await Promise.all(
    workoutExercises.map(async (workoutExercise) => {
      const { data: historicData } = await supabase
        .from('workout_exercises')
        .select(`
          weight,
          created_at,
          archived_workout_id
        `)
        .eq('exercise_id', workoutExercise.exercise_id)
        .is('archived_workout_id', 'not.null')
        .order('created_at', { ascending: false })
        .limit(1);

      if (historicData && historicData.length > 0) {
        return {
          ...workoutExercise,
          previous_weight: historicData[0].weight,
          last_used_at: historicData[0].created_at
        };
      }

      return workoutExercise;
    })
  );

  return exercisesWithHistory || [];
}

export async function addExerciseToWorkout(workoutExercise: Omit<WorkoutExercise, 'id' | 'created_at'>): Promise<WorkoutExercise> {
  // Get the current highest order_index
  const { data: currentExercises } = await supabase
    .from('workout_exercises')
    .select('order_index')
    .eq('workout_id', workoutExercise.workout_id)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrderIndex = currentExercises && currentExercises.length > 0 
    ? (currentExercises[0].order_index || 0) + 1 
    : 0;

  const { data, error } = await supabase
    .from('workout_exercises')
    .insert([{ ...workoutExercise, order_index: nextOrderIndex }])
    .select(`
      *,
      exercise:exercises(*)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateWorkoutExercise(
  id: string,
  updates: Partial<WorkoutExercise>
): Promise<WorkoutExercise> {
  const { data, error } = await supabase
    .from('workout_exercises')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      exercise:exercises(*)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateExercisesOrder(
  workoutId: string,
  exerciseIds: string[]
): Promise<void> {
  // Create updates array with the new order indices
  const updates = exerciseIds.map((id, index) => ({
    id,
    order_index: index
  }));

  // Update each exercise's order_index individually
  for (const update of updates) {
    const { error } = await supabase
      .from('workout_exercises')
      .update({ order_index: update.order_index })
      .eq('id', update.id);

    if (error) {
      throw new Error(`Failed to update order for exercise ${update.id}: ${error.message}`);
    }
  }
}

export async function removeExerciseFromWorkout(id: string): Promise<void> {
  const { error } = await supabase
    .from('workout_exercises')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // After removing, reorder remaining exercises to ensure no gaps
  const { data: remainingExercises, error: fetchError } = await supabase
    .from('workout_exercises')
    .select('id')
    .order('order_index', { ascending: true });

  if (fetchError) {
    throw new Error(`Failed to fetch remaining exercises: ${fetchError.message}`);
  }

  // Update order indices
  await updateExercisesOrder(id, remainingExercises.map(e => e.id));
}