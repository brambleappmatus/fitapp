import { supabase } from '../supabase.js';
import type { User, Workout, Exercise } from '../types/database.js';

async function createTestUser(): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .insert([
      {
        email: 'test@example.com',
        password_hash: '$2a$10$TEST_HASH_NOT_FOR_PRODUCTION'
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating test user: ${error.message}`);
  }

  return user;
}

async function createTestWorkouts(userId: string): Promise<Workout[]> {
  const workouts = [
    { name: 'Push Day', user_id: userId },
    { name: 'Pull Day', user_id: userId },
    { name: 'Leg Day', user_id: userId }
  ];

  const { data, error } = await supabase
    .from('workouts')
    .insert(workouts)
    .select();

  if (error) {
    throw new Error(`Error creating test workouts: ${error.message}`);
  }

  return data;
}

async function createTestExercises(workouts: Workout[]): Promise<void> {
  const exercises = workouts.flatMap(workout => {
    const exercisesByWorkout: Omit<Exercise, 'id'>[] = [];
    
    if (workout.name === 'Push Day') {
      exercisesByWorkout.push(
        {
          workout_id: workout.id,
          name: 'Bench Press',
          sets: 4,
          reps: 8,
          weight: 185,
          icon_url: 'https://example.com/bench-press.svg'
        },
        {
          workout_id: workout.id,
          name: 'Overhead Press',
          sets: 3,
          reps: 10,
          weight: 135,
          icon_url: 'https://example.com/overhead-press.svg'
        }
      );
    } else if (workout.name === 'Pull Day') {
      exercisesByWorkout.push(
        {
          workout_id: workout.id,
          name: 'Barbell Row',
          sets: 4,
          reps: 10,
          weight: 155,
          icon_url: 'https://example.com/barbell-row.svg'
        },
        {
          workout_id: workout.id,
          name: 'Pull-ups',
          sets: 3,
          reps: 12,
          weight: 0,
          icon_url: 'https://example.com/pull-ups.svg'
        }
      );
    } else if (workout.name === 'Leg Day') {
      exercisesByWorkout.push(
        {
          workout_id: workout.id,
          name: 'Squats',
          sets: 5,
          reps: 5,
          weight: 225,
          icon_url: 'https://example.com/squats.svg'
        },
        {
          workout_id: workout.id,
          name: 'Deadlifts',
          sets: 3,
          reps: 8,
          weight: 275,
          icon_url: 'https://example.com/deadlifts.svg'
        }
      );
    }
    
    return exercisesByWorkout;
  });

  const { error } = await supabase
    .from('exercises')
    .insert(exercises);

  if (error) {
    throw new Error(`Error creating test exercises: ${error.message}`);
  }
}

export async function seedDatabase(): Promise<void> {
  try {
    const user = await createTestUser();
    const workouts = await createTestWorkouts(user.id);
    await createTestExercises(workouts);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}