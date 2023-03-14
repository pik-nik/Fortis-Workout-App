CREATE DATABASE fortis;

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY, 
    title TEXT,
    workout_date TIMESTAMP
);
    -- workout_type_id INTEGER,
    -- user_id INTEGER,


-- CREATE TABLE exercise (
--     exercise_ id SERIAL PRIMARY KEY, 
--     exercise_type TEXT, 
-- );

-- CREATE TABLE user (
--     userID SERIAL PRIMARY KEY, 
--     username TEXT, 
-- );