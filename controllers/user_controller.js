const express = require("express")
const router = express.Router()
const db = require("./../db")
const bcrypt = require("bcrypt");
const upload = require("./../middlewares/upload")


// get new user form 
router.get("/users/new", (req, res) => {
    const unableToSignUpString = ""
    res.render("new_user.ejs", { unableToSignUpString })
})

router.get("/users/:userid/photo/edit", (req, res) => {
    const sql = "SELECT username, user_id, profile_photo FROM users where user_id = $1"
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        res.render("edit_user_photo", { user })
    })
})

router.get("/users/:userid/password/edit", (req, res) => {
    const sql = "SELECT username, user_id FROM users where user_id = $1"
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        res.render("edit_user_password", { user })
    })
})

router.get("/users/:userid/edit", (req, res) => {
    const sql = "SELECT username, full_name, email, user_id, profile_photo FROM users where user_id = $1"
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]
        res.render("edit_user", { user })
    })
})

router.get("/users/:userid", (req, res) => {
    const sql = "SELECT username, full_name, email, user_id, profile_photo FROM users where user_id = $1" 
    db.query(sql, [req.params.userid], (err, dbRes) => {
        const user = dbRes.rows[0]

        const sql2 = "SELECT *, TO_CHAR(workout_date, 'FMMonth DD, YYYY') FROM workouts where user_id = $1 ORDER BY workout_date DESC LIMIT 5"
        db.query(sql2, [req.params.userid], (err, dbWorkoutRes) => {
            const workouts = dbWorkoutRes.rows
            res.render("user_details", { user, workouts })
        })
    })
})

// users list
router.get("/users", (req, res) => {
    res.render("users")
})
// create user
router.post("/users", (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const plainTextPassword = req.body.password

    if (!email || !username || !req.body.full_name || !plainTextPassword || !req.body.password_confirmation) {
        res.redirect("/users/new")
    } else {
        const sql1 = "SELECT username, full_name, email, user_id, profile_photo FROM users WHERE email = $1 OR username = $2;"
        db.query(sql1, [email, username], (err, selectRes) => {
            if (selectRes.rows.length > 0) {
                const existingUserList = selectRes.rows
                for (const user of existingUserList) {
                    if (user.email === email) {
                        const unableToSignUpString = "An account already exists with this email, please log in or use a different email"
                        res.render("signup", { unableToSignUpString })
                        // ! change to res.redirect, install flash ejs 
                        return 
                    }
                    if (user.username === username) {
                        const unableToSignUpString = "Username is already taken, please pick another one"
                        res.render("signup", { unableToSignUpString })
                        return 
                    }
                }
            } 
            if (req.body.password !== req.body.password_confirmation) {
                const unableToSignUpString = "Passwords do not match, please try again"
                res.render("signup", { unableToSignUpString })
                return 
            } 
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(plainTextPassword, salt, (err, digestedPassword) => {
                    const default_profile_picture_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
                    const sql2 = "INSERT INTO users (email, username, full_name, password_digest, profile_photo) VALUES ($1, $2, $3, $4, $5) RETURNING user_id;" 
                    db.query(sql2, [email, username, req.body.full_name, digestedPassword, default_profile_picture_url], (err, insertRes) => {
                        req.session.userId = insertRes.rows[0].user_id
                        res.redirect("/")
                    })
                })
            })  
        })
    }
}) 

router.put("/users/:userid/photo", upload.single("uploadedFile"), (req, res) => {
    // if(!req.file.path) {
    //     req.redirect(`/users/${req.params.userid}/photo/edit`)
    // } else { //! ask about this if condition to prevent route breaking
        const sql = `UPDATE users SET profile_photo = $1 where user_id = $2`
        db.query(sql, [req.file.path, req.params.userid], (err, dbRes) => {
            res.redirect(`/users/${req.params.userid}`)
        })
    // }
})

router.put("/users/:userid/password", (req, res) => {
    if (!req.body.password || !req.body.password_confirmation) {
        res.redirect(`/users/${req.params.userid}/password/edit`)
    } else {
        if (req.body.password !== req.body.password_confirmation) {
            console.log("Passwords do not match, please try again") //! flash this message
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

 // update single user 
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
                        // const unableToEditString = "An account already exists with this email, please put a different email" //! flash this message 
                        console.log("An account already exists with this email, please put a different email");
                        res.redirect(`/users/${req.params.userid}/edit`)
                        return //! when flashing maybe see if we can flash two messages
                    }
                    if (existingUser.username === username && existingUser.user_Id !== req.params.id) {
                        //const unableToEditString = "Username is taken" //! flash this message
                        console.log("Username is taken"); 
                        res.redirect(`/users/${req.params.userid}/edit`)
                        return
                    }
                }
            } 
            const sql2 = "UPDATE users SET full_name = $1, email = $2, username = $3 where user_id = $4"
            db.query(sql2, [req.body.full_name, email, username, req.params.userid], (err, UpdateRes) => {
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
// make function to ensure logged in as user 

module.exports = router