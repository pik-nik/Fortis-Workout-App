CREATE DATABASE fortis;

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY, 
    title TEXT,
    workout_date TIMESTAMP,
    user_id INTEGER
);
    -- workout_type_id INTEGER,
    -- user_id INTEGER,


CREATE TABLE exercises (
    id SERIAL PRIMARY KEY, 
    name TEXT 
);

CREATE TABLE workout_exercise_junction (
    id SERIAL PRIMARY KEY, 
    exercise_id INTEGER,
    workout_id INTEGER 
);

CREATE TABLE workout_exercise_junction2 (
    id SERIAL PRIMARY KEY, 
    exercise_id INT REFERENCES exercises(id),
    workout_id INT REFERENCES workouts(id) 
);


-- CREATE TABLE user (
--     userID SERIAL PRIMARY KEY, 
--     username TEXT, 
-- );

SELECT exercise_id FROM workout_exercise_junction WHERE workout_id = 1;

SELECT name FROM exercises JOIN workout_exercise_junction ON exercises.id = workout_exercise_junction.exercise_id WHERE workout_id = 1;