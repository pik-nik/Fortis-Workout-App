CREATE DATABASE fortis;

CREATE TABLE workout (
    id SERIAL PRIMARY KEY, 
    title TEXT,
    image_url TEXT,
    user_id INTEGER
);

CREATE TABLE exercise (
    exercise_ id SERIAL PRIMARY KEY, 
    exercise_type TEXT, 
);

CREATE TABLE user (
    userID SERIAL PRIMARY KEY, 
    username TEXT, 
);