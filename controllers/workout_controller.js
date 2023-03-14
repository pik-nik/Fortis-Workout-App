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
    res.render("new_exercise")
})
//display workout
router.get('/workouts/:id', (req, res) => {
    const sql = `SELECT * FROM workouts WHERE id = $1;`
    db.query(sql, [req.params.id], (err, dbRes) => {
        const workout = dbRes.rows[0]
        res.render("workout_details", { workout })
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

router.post('/workouts',  (req, res) => {

    console.log(req.body);
  
    const sql = `INSERT INTO workouts (title, workout_date) VALUES ($1, $2);`
    
    db.query(sql, [req.body.title, req.body.workout_date], (err, dbRes) => {
         // add later req.session.userId or  res.locals.currentUser.id
        res.redirect('/workouts')
    })
})


module.exports = router