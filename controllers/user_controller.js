const express = require("express")
const router = express.Router()
const db = require("./../db")
const bcrypt = require("bcrypt");


// get new user form 
router.get("/users/new", (req, res) => {
    const unableToSignUpString = "" //! make separate strings
    res.render("signup", { unableToSignUpString })
})
router.get("/users/:userid", (req, res) => {
    const userId = req.params.userid
    res.render("user_details")
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

    const sql1 = `SELECT * FROM users WHERE email = $1 OR username = $2;`
    db.query(sql1, [email, username], (err, selectRes) => {
        if (selectRes.rows.length > 0) {
            const existingUserList = selectRes.rows
            for (const user of existingUserList) {
                if (user.email === email) {
                    const unableToSignUpString = "An account already exists with this email, please log in or use a different email"
                    res.render("signup", { unableToSignUpString })
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
                const sql2 = "INSERT INTO users (email, username, full_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING user_id;" //! insert default profile pic later
                db.query(sql2, [email, username, req.body.full_name, digestedPassword], (err, insertRes) => {
                    req.session.userId = insertRes.rows[0].user_id
                    res.redirect("/")
                })
            })
        })  
    })
}) 

// // get existing user form 
// router.get("/users/:id/edit", (req, res) => {
//     const sql = "SELECT * FROM users where id = $1"
//     db.query(sql, [req.params.id], (err, dbRes) => {
//         const userDetails = dbRes.rows[0]
//         res.render("edit_user", {user: userDetails})
//     })
// }) 

//  // update single user 
// router.put("/users/:id", (req, res) => {
//     res.send("in progress")
// })

// make function to ensure logged in as user 

module.exports = router