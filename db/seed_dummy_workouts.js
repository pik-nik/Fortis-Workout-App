const db = require("./../db")

let workouts = ["Block 1 Day 1", "Block 1 Day 2", "Block 2 Day 3", "Block 1 Day 4", "Block 2 Day 1", "Block 2 Day 2", "Block 3 Day 3", "Block 3 Day 4"]

let workoutDate = "2023-03-14"

let userId = 1

for (let i = 0; i < workouts.length; i++) {
    const sql = "INSERT INTO workouts (name, workout_date, user_id) VALUES ($1, $2, $3);"
    db.query(sql, [workouts[i], workoutDate, userId], (err, dbRes) => {
    })
}
