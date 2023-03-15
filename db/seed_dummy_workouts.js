const db = require("./../db")

let workouts = ["Week 1 Day 1", "Week 1 Day 2", "Week 1 Day 3", "Week 1 Day 4", "Week 2 Day 1", "Week 2 Day 2", "Week 2 Day 3", "Week 2 Day 4"]

let workoutDate = new Date();

let userId = 1

for (let i = 0; i < workouts.length; i++) {
    const sql = "INSERT INTO workouts (name, workout_date, user_id) VALUES ($1, $2, $3);"
    db.query(sql, [workouts[i], workoutDate, userId], (err, dbRes) => {
    })
}
