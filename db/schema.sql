CREATE DATABASE fortis;

DROP TABLE workouts;
DROP TABLE exercises;
DROP TABLE workout_exercise_junction;
DROP TABLE log_workout_entries;

CREATE TABLE workouts (
    workout_id SERIAL PRIMARY KEY, 
    name TEXT,
    workout_date DATE,
    user_id INTEGER
);

CREATE TABLE exercises (
    exercise_id SERIAL PRIMARY KEY, 
    name TEXT 
);

CREATE TABLE workout_exercise_junction (
    junction_id SERIAL PRIMARY KEY, 
    exercise_id INTEGER,
    workout_id INTEGER 
);

CREATE TABLE log_workout_entries (
    log_id SERIAL PRIMARY KEY,
    sets integer,
    reps integer, 
    weight real, 
    junction_id integer,
    user_id integer
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    username TEXT,
    full_name TEXT,
    email TEXT, 
    password_digest TEXT,
    profile_photo TEXT
);
-- node seed_dummy_exercises;
-- node seed_dummy_users;
