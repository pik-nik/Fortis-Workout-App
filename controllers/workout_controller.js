const express = require("express")
const router = express.Router()
const db = require("./../db")

router.get("/", (req, res) => {
    res.render("home")
})
//add new workout
router.get("/workouts/new", (req, res) => {
    res.render("new_workout")
})
//add new exercise
router.get("/workouts/:id/exercise/new", (req, res) => {
    const workoutId = req.params.id
    
    res.render("new_exercise", { workoutId })
})
//display workout
router.get("/workouts/:id", (req, res) => {
    const sql = "SELECT * FROM workouts WHERE id = $1;"

    db.query(sql, [req.params.id], (err, dbRes) => {
        const workout = dbRes.rows[0]
        const sql2 = "SELECT name FROM exercises JOIN workout_exercise_junction ON exercises.id = workout_exercise_junction.exercise_id WHERE workout_id = $1;"
        db.query(sql2, [req.params.id], (err, dbJunctionRes) => {
            const exercises = dbJunctionRes.rows
            res.render("workout_details", { workout, exercises })
        })
    })
})
// list of workouts
router.get("/workouts", (req, res) => {
    const sql = "SELECT * FROM workouts ORDER BY workout_date DESC;"

    db.query(sql, (err, dbRes) => {
        const workouts = dbRes.rows
        res.render("workouts", { workouts })
    })
    
})

router.post("/workouts/:id",  (req, res) => {
    const workoutId = req.params.id
    const sql = "INSERT INTO exercises (name) VALUES ($1) returning id;"
    
    db.query(sql, [req.body.name], (err, dbExerciseRes) => {
         // add later req.session.userId or  res.locals.currentUser.id
         const exerciseId = dbExerciseRes.rows[0].id
        const sql2 = "INSERT INTO workout_exercise_junction (exercise_id, workout_id) VALUES ($1, $2)"
        db.query(sql2, [exerciseId, workoutId], (err, dbJunctionRes) => {
            res.redirect(`/workouts/${workoutId}`)
        })
    })
})


router.post("/workouts",  (req, res) => {
    const sql = "INSERT INTO workouts (title, workout_date) VALUES ($1, $2) returning id;"
    
    db.query(sql, [req.body.title, req.body.workout_date], (err, dbRes) => {
         // add later req.session.userId or  res.locals.currentUser.id
        res.redirect(`/workouts/${dbRes.rows[0].id}`)
    })
})


module.exports = router