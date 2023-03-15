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
    
    const sql = "SELECT * FROM exercises ORDER BY name ASC;"
    db.query(sql, (err, dbRes) => {
        console.log(dbRes.rows);
        const exercises = dbRes.rows
        res.render("new_exercise", { workoutId, exercises })
    })
    
})
// edit log entry 
router.get("/workouts/:workoutid/exercise/:exerciseid/log/:logid/edit", (req, res) => {
    const sql = "SELECT * FROM log_workout_entries JOIN workout_exercise_junction ON log_workout_entries.junction_id = workout_exercise_junction.junction_id JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id WHERE log_id = $1;"
    
    db.query(sql, [req.params.logid], (err, dbRes) => {
        const log = dbRes.rows[0]
        console.log(log);
        res.render("edit_log", { log })
    })
})
// edit exercise name 
router.get("/workouts/:workoutid/exercise/:exerciseid/edit", (req, res) => {
    const workoutId = req.params.workoutid
    const exerciseId = req.params.exerciseid
    const sql1 = "SELECT * FROM exercises WHERE exercise_id = $1"
    db.query(sql1, [exerciseId], (err, dbRes) => {
        const currentExercise = dbRes.rows[0]
        console.log(currentExercise);

        const sql2 = "SELECT * FROM exercises ORDER BY name ASC;"
        db.query(sql2, (err, dbALLExRes) => {
            const exercises = dbALLExRes.rows
            
            const sql3 = "SELECT * FROM workout_exercise_junction WHERE workout_id = $1 and exercise_id = $2"
            db.query(sql3, [workoutId, exerciseId], (err, dbJunctionRes) => {
                const junctionId = dbJunctionRes.rows[0].junction_id
                console.log(junctionId);
                res.render("edit_exercise", {workoutId, exerciseId, currentExercise, exercises, junctionId})
            })
        })
    })
}) 
//display exercise in workout
router.get("/workouts/:workoutid/exercise/:exerciseid", (req, res) => {
    const sql = "SELECT * FROM exercises where exercise_id = $1"
    const workoutId = req.params.workoutid
    const exerciseId = req.params.exerciseid
    db.query(sql, [exerciseId], (err, dbRes) => {
        const exercise = dbRes.rows[0]
        console.log(exercise);
        const sql2 = "SELECT * FROM workout_exercise_junction where exercise_id = $1 and workout_id = $2" // check junctions returning a few times here 
        db.query(sql2, [exerciseId, workoutId], (err, dbJunctionRes) => {
            const junctionId = dbJunctionRes.rows[0].junction_id
            console.log(junctionId, "junction id");
            res.render("new_log", { exercise, workoutId, exerciseId, junctionId })
        })
    })
})
//display workout
router.get("/workouts/:id", (req, res) => {
    const sql = "SELECT * FROM workouts WHERE workout_id = $1;"

    db.query(sql, [req.params.id], (err, dbRes) => {
        const workout = dbRes.rows[0]
        const sql2 = "SELECT * FROM exercises JOIN workout_exercise_junction ON exercises.exercise_id = workout_exercise_junction.exercise_id WHERE workout_id = $1 ORDER BY junction_id;"
        db.query(sql2, [req.params.id], (err, dbJunctionRes) => {
            const exercises = dbJunctionRes.rows
            console.log("exercises",exercises); //[ { exercise_id: 2, name: 'SQUAT', junction_id: 3, workout_id: 10 } ]
            const sql3 = "SELECT * FROM log_workout_entries JOIN workout_exercise_junction ON log_workout_entries.junction_id = workout_exercise_junction.junction_id JOIN exercises on exercises.exercise_id = workout_exercise_junction.exercise_id;"
            db.query (sql3, (err, dbLogRes) => {
                const logdatas = dbLogRes.rows
                console.log("log datas",logdatas);
                res.render("workout_details", { workout, exercises, logdatas })
            })
        })
    })
})
// list of workouts
router.get("/workouts", (req, res) => {
    const sql = "SELECT * FROM workouts ORDER BY workout_date DESC;"

    db.query(sql, (err, dbRes) => {
        const workouts = dbRes.rows
        console.log("workouts",workouts);

        const sql2 = "SELECT * FROM workout_exercise_junction JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id;"
        db.query(sql2, (err, dbJunctionRes) => {
            console.log("exercises in workouts",dbJunctionRes.rows);
            const exercisesInWorkouts = dbJunctionRes.rows;
            res.render("workouts", { workouts, exercisesInWorkouts })
        })
    })
})

router.get("/workouts/:id/edit",  (req, res) => {
    const sql = "SELECT * FROM workouts WHERE workout_id = $1"
    
    db.query(sql, [req.params.id], (err, dbRes) => {
        const workout = dbRes.rows[0]
        res.render("edit_workout", {workout})
    })
})

router.post("/workouts/:workoutid/exercise/:exerciseid",  (req, res) => {    
    const sql = "INSERT INTO log_workout_entries (sets, reps, weight, junction_id, user_id) VALUES ($1, $2, $3, $4, $5);"
    // hard coded user id for now
    console.log("junction id on post",req.body.junction_id);
    db.query(sql, [req.body.sets, req.body.reps, req.body.weight, req.body.junction_id, 1], (err, dbRes) => {
        res.redirect(`/workouts/${req.params.workoutid}`)
    })
})

router.post("/workouts/:id",  (req, res) => {
    const workoutId = req.params.id
    // if else statement to stop duplicate exercise names
    const exerciseName = req.body.name 
    const sql1 = "SELECT * FROM exercises WHERE name = $1;"
    db.query (sql1, [exerciseName.toUpperCase()], (err, dbSelectExerciseRes) => {
        if (dbSelectExerciseRes.rows.length !== 0) {
            const exerciseId = dbSelectExerciseRes.rows[0].exercise_id
            // console.log("exerciseId from db", exerciseId);
            const sql2 = "INSERT INTO workout_exercise_junction (exercise_id, workout_id) VALUES ($1, $2)"
                
                db.query(sql2, [exerciseId, workoutId], (err, dbJunctionRes) => {
                    res.redirect(`/workouts/${workoutId}/exercise/${exerciseId}`)
                })
        } else {
            const sql2 = "INSERT INTO exercises (name) VALUES ($1) returning exercise_id;"
            db.query(sql2, [exerciseName.toUpperCase()], (err, dbInsertExerciseRes) => {
                const exerciseId = dbInsertExerciseRes.rows[0].exercise_id
                // console.log("exerciseId new", exerciseId);
                const sql3 = "INSERT INTO workout_exercise_junction (exercise_id, workout_id) VALUES ($1, $2)"

                db.query(sql3, [exerciseId, workoutId], (err, dbJunctionRes) => {
                    res.redirect(`/workouts/${workoutId}/exercise/${exerciseId}`)
                })
            })
        }
    })
})

router.post("/workouts",  (req, res) => {
    const sql = "INSERT INTO workouts (name, workout_date) VALUES ($1, $2) returning workout_id;"
    db.query(sql, [req.body.name, req.body.workout_date], (err, dbRes) => {
         // add later req.session.userId or  res.locals.currentUser.id
        res.redirect(`/workouts/${dbRes.rows[0].workout_id}`)
    })
})

router.put("/workouts/:workoutid/exercise/:exerciseid/log/:logid", (req, res) => {
    const sql = "UPDATE log_workout_entries SET sets = $1, reps = $2, weight =$3 WHERE log_id = $4;"
    db.query(sql, [req.body.sets, req.body.reps, req.body.weight, req.params.logid], (err, dbRes) => {
        res.redirect(`/workouts/${req.params.workoutid}`)
    })
})

router.put("/workouts/:workoutid/exercise/:exerciseid", (req, res) => {
    const newName = req.body.name
    const sql1 = "SELECT * FROM exercises WHERE name = $1"
    console.log(req.body.junction_id);
    db.query (sql1, [newName.toUpperCase()], (err, dbSelectExerciseRes) => {
        if (dbSelectExerciseRes.rows.length !== 0) {
            const newExerciseId = dbSelectExerciseRes.rows[0].exercise_id
            // console.log("NEW EXERCISE ID",newExerciseId);
            console.log("exercise alreeady in db");
            const sql2 = "UPDATE workout_exercise_junction SET exercise_id = $1 WHERE junction_id = $2;"
            db.query (sql2, [newExerciseId, req.body.junction_id], (err, dbUpdateRes) => {
                res.redirect(`/workouts/${req.params.workoutid}`)
            })
        } else { // add new name to exercise list then update junction 
            const sql2 = "INSERT INTO exercises (name) VALUES ($1) returning exercise_id;"
            db.query(sql2, [newName.toUpperCase()], (err, dbInsertExerciseRes) => {
                const newExerciseId = dbInsertExerciseRes.rows[0].exercise_id
                const sql3 = "UPDATE workout_exercise_junction SET exercise_id = $1 WHERE junction_id = $2;"
                console.log("this is a new exercise");
                db.query(sql3, [newExerciseId, req.body.junction_id], (err, dbUpdateRes) => {
                    res.redirect(`/workouts/${req.params.workoutid}`)
                })
            })
        }
    })
})

router.put("/workouts/:id", (req, res) => {
    const sql = "UPDATE workouts SET name = $1, workout_date = $2 WHERE workout_id = $3;"
    db.query(sql, [req.body.name, req.body.date, req.params.id], (err, dbRes) => {
        res.redirect(`/workouts/${req.params.id}`)
    })
})

router.delete("/workouts/:workoutid/exercise/:exerciseid/log/:logid", (req, res) => {
    const sql = "DELETE FROM log_workout_entries WHERE log_id = $1;" 
    db.query(sql, [req.params.logid], (err, dbRes) => {
        res.redirect(`/workouts/${req.params.workoutid}`)
    })
})

router.delete("/workouts/:workoutid/exercise/:exerciseid", (req, res) => {
    const sql = "DELETE FROM exercises WHERE exercise_id = $1;"
    db.query(sql, [req.params.exerciseid], (err, dbRes) => {
        res.redirect(`/workouts/${req.params.workoutid}`)
    })
})

router.delete("/workouts/:id", (req, res) => {
    const sql = "DELETE FROM workouts WHERE workout_id = $1;"
    db.query(sql, [req.params.id], (err, dbRes) => {
        res.redirect('/workouts')
    })
})



module.exports = router