const express = require("express")
const router = express.Router()
const db = require("./../db")
const bcrypt = require("bcrypt");
const upload = require("./../middlewares/upload")
const ensureLoggedIn = require("./../middlewares/ensure_logged_in")

router.get("/users/new", (req, res) => {
    res.render("new_user.ejs", { message: req.flash('info') })
})

router.get("/users/:userid/photo/edit", ensureLoggedIn, (req, res) => {
    const sql = "SELECT username, user_id, profile_photo FROM users where user_id = $1"
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        res.render("edit_user_photo", { user })
    })
})

router.get("/users/:userid/password/edit",  ensureLoggedIn, (req, res) => {
    const sql = "SELECT username, user_id FROM users where user_id = $1"
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        res.render("edit_user_password", { user, message: req.flash('info')})
    })
})

router.get("/users/:userid/edit",  ensureLoggedIn, (req, res) => {
    if (Number(req.params.userid) !== req.session.userId) {
        res.redirect(`/users/`)
    } else {        
        const sql = "SELECT username, full_name, email, user_id, profile_photo FROM users where user_id = $1"
        db.query(sql, [req.params.userid], (err, dbRes) => {
            const user = dbRes.rows[0]
            res.render("edit_user", { user, message: req.flash('info')})
        })
    }
})

router.get("/users/workouts", ensureLoggedIn, (req, res) => {
        res.redirect(`/users/${req.session.userId}/workouts`)
})

router.get("/users/:userid/workouts",  ensureLoggedIn, (req, res) => {
    const sql = "SELECT *, TO_CHAR(workout_date, 'FMMonth DD, YYYY') FROM workouts WHERE user_id = $1 ORDER BY workout_date DESC;"
    // console.log(req.session.userId, "session userId");
   const currentUserSessionId = req.session.userId
   const workoutUserId = req.params.userid
    db.query(sql, [workoutUserId], (err, dbRes) => {
        const workouts = dbRes.rows
        // console.log("workouts",workouts);
        const sql2 = "SELECT * FROM workout_exercise_junction JOIN exercises ON workout_exercise_junction.exercise_id = exercises.exercise_id;"
        db.query(sql2, (err, dbJunctionRes) => {
            // console.log("exercises in workouts",dbJunctionRes.rows);
            const exercisesInWorkouts = dbJunctionRes.rows;

            const sql3 = "SELECT * FROM users where user_id = $1"
            db.query(sql3, [req.params.userid], (err, dbUsersRes) => {
                const user = dbUsersRes.rows[0]
                res.render("user_workouts", { workouts, exercisesInWorkouts, user, currentUserSessionId })

            })

        })
    })
})

router.get("/users/:userid",  ensureLoggedIn, (req, res) => {
    const sql = "SELECT username, full_name, email, user_id, profile_photo FROM users where user_id = $1" 
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        const userIdLoggedIn = req.session.userId
        const sql2 = "SELECT *, TO_CHAR(workout_date, 'FMMonth DD, YYYY') FROM workouts where user_id = $1 ORDER BY workout_date DESC LIMIT 5"
        db.query(sql2, [req.params.userid], (err, dbWorkoutRes) => {
            const workouts = dbWorkoutRes.rows
            res.render("user_details", { user, workouts, userIdLoggedIn })
        })
    })
})

router.get("/users",  ensureLoggedIn, (req, res) => {
    const sql = "SELECT username, full_name, email, user_id, profile_photo FROM users"
    db.query(sql, (err, dbRes) => {
        const users = dbRes.rows
        res.render("users", { users })
    })
})

router.post("/users", (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const plainTextPassword = req.body.password

    if (!email || !username || !req.body.full_name || !plainTextPassword || !req.body.password_confirmation) {
        res.redirect("/users/new")
    } else {
        const sql1 = "SELECT username, full_name, email, user_id, profile_photo FROM users WHERE email = $1 OR username = $2;"
        db.query(sql1, [email, username.toLowerCase()], (err, selectRes) => {
            if (selectRes.rows.length > 0) {
                const existingUserList = selectRes.rows
                for (const user of existingUserList) {
                    if (user.email === email) {
                        req.flash("info", "An account already exists with this email, please log in or use a different email")
                        res.redirect("/users/new")
                        return 
                    }
                    if (user.username === username.toLowerCase()) {
                        const unableToSignUpString = "Username is already taken, please pick another one"
                        req.flash("info", "Username is already taken, please pick another one")
                        res.redirect("/users/new")
                        return 
                    }
                }
            } 
            if (req.body.password !== req.body.password_confirmation) {
                req.flash("info", "Passwords do not match, please try again")
                res.redirect("/users/new")
                return 
            } 
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(plainTextPassword, salt, (err, digestedPassword) => {
                    const default_profile_picture_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
                    const sql2 = "INSERT INTO users (email, username, full_name, password_digest, profile_photo) VALUES ($1, $2, $3, $4, $5) RETURNING user_id;" 
                    db.query(sql2, [email, username.toLowerCase(), req.body.full_name, digestedPassword, default_profile_picture_url], (err, insertRes) => {
                        req.session.userId = insertRes.rows[0].user_id

                        res.redirect(`/users/${insertRes.rows[0].user_id}`)
                    })
                })
            })  
        })
    }
}) 

router.put("/users/:userid/photo", upload.single("uploadedFile"), (req, res) => {
    const sql = `UPDATE users SET profile_photo = $1 where user_id = $2`
    db.query(sql, [req.file.path, req.params.userid], (err, dbRes) => {
        res.redirect(`/users/${req.params.userid}`)
    })
})

router.put("/users/:userid/password", (req, res) => {
    if (!req.body.password || !req.body.password_confirmation) {
        res.redirect(`/users/${req.params.userid}/password/edit`)
    } else {
        if (req.body.password !== req.body.password_confirmation) {
            req.flash("info", "Passwords do not match, please try again")
            res.redirect(`/users/${req.params.userid}/password/edit`)
            return 
        } 
        const plainTextPassword = req.body.password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(plainTextPassword, salt, (err, digestedPassword) => {
                const sql = `UPDATE users SET password_digest = $1 where user_id = $2`
                db.query(sql, [digestedPassword, req.params.userid], (err, dbRes) => {
                    res.redirect(`/users/${req.params.userid}`)
                })
            })
        })  
    }
})

router.put("/users/:userid", (req, res) => {
    const email = req.body.email
    const username = req.body.username
    if (!email || !username || !req.body.full_name) {
        res.redirect(`/users/${req.params.userid}/edit`)
    } else {
        const sql1 = "SELECT username, full_name, email, user_id, profile_photo FROM users WHERE email = $1 OR username = $2;"
        db.query(sql1, [email, username], (err, selectRes) => {
            if (selectRes.rows.length > 0) {
                const existingUserList = selectRes.rows
                console.log("exisiting user list:",existingUserList );
                console.log("user id", req.params.userid);
                for (const existingUser of existingUserList) {
                    if ((existingUser.email === email) && (existingUser.user_id !== Number(req.params.userid))) {
                        req.flash("info", "An account already exists with this email, please put a different email")
                        res.redirect(`/users/${req.params.userid}/edit`)
                        return 
                    }
                    if (existingUser.username === username.toLowerCase() && existingUser.user_Id !== Number(req.params.id)) {
                        req.flash("info", "Username is taken, please pick another one")
                        res.redirect(`/users/${req.params.userid}/edit`)
                        return
                    }
                }
            } 
            const sql2 = "UPDATE users SET full_name = $1, email = $2, username = $3 where user_id = $4"
            db.query(sql2, [req.body.full_name, email, username.toLowerCase(), req.params.userid], (err, UpdateRes) => {
                res.redirect(`/users/${req.params.userid}`)
            })
        })
    }
})

router.delete("/users/:id", (req, res) => {
    const sql = "DELETE FROM users WHERE user_id = $1;"
    db.query(sql, [req.params.id], (err, dbRes) => {
        delete req.session.userId
        res.redirect('/login')
    }) 
})

module.exports = router