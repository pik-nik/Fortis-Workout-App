CREATE DATABASE fortis;

DROP TABLE workouts;
DROP TABLE exercises;
DROP TABLE workout_exercise_junction;
DROP TABLE log_workout_entries;

CREATE TABLE workouts (
    workout_id SERIAL PRIMARY KEY, 
    name TEXT,
    workout_date TIMESTAMP,
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
    weight integer, 
    junction_id integer,
    user_id integer
);

-- CREATE TABLE workout_exercise_junction2 (
--     junction_id SERIAL PRIMARY KEY, 
--     exercise_id INT REFERENCES exercises(exercise_id),
--     workout_id INT REFERENCES workouts(workout_id) 
-- );


-- CREATE TABLE user (
--     userID SERIAL PRIMARY KEY, 
--     username TEXT, 
-- );

SELECT * FROM workout_exercise_junction WHERE workout_id = 1;

SELECT * FROM exercises JOIN workout_exercise_junction ON exercises.exercise_id = workout_exercise_junction.exercise_id WHERE workout_id = 9;

SELECT * FROM log_workout_entries JOIN workout_exercise_junction ON log_workout_entries.junction_id = workout_exercise_junction.junction_id JOIN exercises on exercises.exercise_id = workout_exercise_junction.exercise_id;

 log_id | sets | reps | weight | junction_id | user_id | junction_id | exercise_id | workout_id | exercise_id |  name  
--------+------+------+--------+-------------+---------+-------------+-------------+------------+-------------+--------
      1 |    5 |    3 |    120 |           4 |       1 |           4 |           1 |         10 |           1 | SQUATS
(1 row)

SELECT * FROM workout_exercise_junction JOIN workouts ON workout_exercise_junction.workout_id = workouts.workout_id JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id where workout_id = 10;

SELECT * FROM log_workout_entries JOIN workout_exercise_junction ON log_workout_entries.junction_id = workout_exercise_junction.junction_id JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id WHERE log_id = 1;

SELECT * FROM workout_exercise_junction JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id WHERE workout_id = 2;