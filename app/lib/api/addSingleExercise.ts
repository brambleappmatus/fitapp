import { supabase } from '../supabase.js';
import { getWorkouts } from './workouts.js';

async function addSingleExercise() {
  try {
    // Get the first workout from the database
    const workouts = await getWorkouts();
    if (workouts.length === 0) {
      throw new Error('No workouts found. Please run the seed script first.');
    }

    const workout = workouts[0];

    // Add a single exercise
    const { data: exercise, error } = await supabase
      .from('exercises')
      .insert([
        {
          workout_id: workout.id,
          name: 'Dumbbell Flyes',
          sets: 3,
          reps: 12,
          weight: 40,
          icon_url: 'https://example.com/dumbbell-flyes.svg'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Exercise added successfully:', exercise);
    process.exit(0);
  } catch (error) {
    console.error('Error adding exercise:', error);
    process.exit(1);
  }
}

addSingleExercise();