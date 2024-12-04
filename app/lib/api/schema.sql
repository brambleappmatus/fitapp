-- Drop existing tables if they exist
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS archived_workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;

-- Create exercises table
CREATE TABLE exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    default_sets INT NOT NULL DEFAULT 3,
    default_reps INT NOT NULL DEFAULT 10,
    default_weight FLOAT NOT NULL DEFAULT 20.0,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create workouts table (templates only)
CREATE TABLE workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create archived_workouts table
CREATE TABLE archived_workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_template_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    score INT CHECK (score >= 1 AND score <= 5),
    date TIMESTAMP DEFAULT NOW()
);

-- Create workout_exercises table
CREATE TABLE workout_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    archived_workout_id UUID REFERENCES archived_workouts(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight FLOAT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT workout_reference_check CHECK (
        (workout_id IS NOT NULL AND archived_workout_id IS NULL) OR
        (workout_id IS NULL AND archived_workout_id IS NOT NULL)
    )
);

-- Create function to update exercise order
CREATE OR REPLACE FUNCTION update_exercise_order(updates jsonb[])
RETURNS void AS $$
BEGIN
    FOR i IN 1..array_length(updates, 1) LOOP
        UPDATE workout_exercises
        SET order_index = (updates[i]->>'order_index')::int
        WHERE id = (updates[i]->>'id')::uuid;
    END LOOP;
END;
$$ LANGUAGE plpgsql;