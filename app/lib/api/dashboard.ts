import { supabase } from '../supabase';
import { DateRange } from '@/app/hooks/useDateRange';

export async function getDashboardStats(timeFrame: string, startDate: Date, endDate: Date) {
  // Format dates for database query
  const start = startDate.toISOString();
  const end = endDate.toISOString();

  // Get all exercises first
  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('*')
    .order('name');

  if (exercisesError) throw new Error('Failed to fetch exercises');

  // Get workouts within the time frame
  const { data: workouts, error: workoutsError } = await supabase
    .from('archived_workouts')
    .select(`
      *,
      workout_exercises (
        *,
        exercise:exercises(*)
      )
    `)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true });

  if (workoutsError) throw new Error('Failed to fetch workout data');

  // If no data found for the selected range, get the nearest available data point
  if (!workouts || workouts.length === 0) {
    const { data: nearestWorkout, error: nearestError } = await supabase
      .from('archived_workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercise:exercises(*)
        )
      `)
      .lte('date', end)
      .order('date', { ascending: false })
      .limit(1);

    if (nearestError) throw new Error('Failed to fetch nearest workout data');

    // If we found a nearest workout, use its date as the start date
    if (nearestWorkout && nearestWorkout.length > 0) {
      const nearestDate = new Date(nearestWorkout[0].date);
      return getDashboardStats(timeFrame, nearestDate, endDate);
    }
  }

  // Calculate stats for the current period
  const totalWorkouts = workouts?.length || 0;
  const totalWeight = workouts?.reduce((sum, workout) => 
    sum + workout.workout_exercises.reduce((exerciseSum, exercise) => 
      exerciseSum + (exercise.weight * exercise.sets * exercise.reps), 0
    ), 0
  ) || 0;
  const avgScore = workouts?.reduce((sum, workout) => sum + (workout.score || 0), 0) / totalWorkouts || 0;

  // Process workout data for the performance chart
  const performanceData = workouts?.map(workout => ({
    date: workout.date,
    totalWeight: workout.workout_exercises.reduce((sum, exercise) => 
      sum + (exercise.weight * exercise.sets * exercise.reps), 0
    )
  })) || [];

  // Process exercise-specific data for the progress chart
  const exerciseProgressData = workouts?.reduce((acc: any[], workout) => {
    const workoutDate = workout.date;
    const exerciseData: { [key: string]: number } = {};

    workout.workout_exercises.forEach(exercise => {
      if (exercise.exercise) {
        exerciseData[exercise.exercise.id] = exercise.weight;
      }
    });

    // Find existing entry for this date or create new one
    const existingEntry = acc.find(entry => entry.date === workoutDate);
    if (existingEntry) {
      Object.assign(existingEntry, exerciseData);
    } else {
      acc.push({
        date: workoutDate,
        ...exerciseData
      });
    }

    return acc;
  }, []) || [];

  // Get recent activity
  const recentActivity = workouts?.slice(0, 5).map(workout => ({
    id: workout.id,
    name: workout.name,
    date: workout.date,
    score: workout.score
  })) || [];

  return {
    totalWorkouts,
    totalWeight: Math.round(totalWeight),
    avgScore: Math.round(avgScore * 10) / 10,
    performanceData,
    exerciseProgressData,
    exercises,
    recentActivity
  };
}

export async function getRecentActivity(limit = 5) {
  const { data, error } = await supabase
    .from('archived_workouts')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Failed to fetch recent activity');
  return data;
}