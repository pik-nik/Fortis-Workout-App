const express = require("express")
const router = express.Router()
const db = require("./../db")
const bcrypt = require("bcrypt");

module.exports = router


// get new user form 
// router.get('/users/new', (req, res) => {
//     const unableToSignUpString = ""
//     res.render("signup", { unableToSignUpString })
// })

// // create user
// router.post('/users', (req, res) => {
//     const email = req.body.email
//     const plainTextPassword = req.body.password

//     const sql1 = `SELECT * from users where email = $1;`
//     db.query(sql1, [email], (err, selectRes) => {
//         if (selectRes.rows.length > 0) {
//             const unableToSignUpString = "An account already exists with this email, please log in or use a different email"
//             res.render("signup", { unableToSignUpString })
//             return 
//         } 
        
//         if (req.body.password !== req.body.password_confirmation) {
//             const unableToSignUpString = "Passwords do not match, please try again"
//             res.render("signup", { unableToSignUpString })
//             return 
//         } 
        
//         const saltRounds = 10;
//         bcrypt.genSalt(saltRounds, (err, salt) => {
//             bcrypt.hash(plainTextPassword, salt, (err, digestedPassword) => {
//                 const sql2 = `INSERT INTO users (email, password_digest) VALUES ($1, $2) returning id;`
                
//                 db.query(sql2, [email, digestedPassword], (err, insertRes) => {
//                     req.session.userId = insertRes.rows[0].id
//                     res.redirect("/")
//                 })
//             })
//         })  
//     })
// }) 

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