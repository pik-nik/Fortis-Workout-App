const express = require("express")
const router = express.Router()
const db = require("./../db")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
    res.render("home")
})

router.get("/login", (req, res) => {
    const unsuccessfulString = ""
    res.render("login", { message: req.flash('info') })
}) 

router.post("/sessions", (req, res) => {
    const { email, password } = req.body 
    if (!email || !password) {  
        res.redirect("/login")
    } else {
        const sql = `SELECT * FROM users WHERE email = '${email}'`
        db.query(sql, (err, dbRes) => {
            if (dbRes.rows.length === 0) { // if no user exists
                req.flash("info", "Account does not exist with this email")
                res.redirect("/login")
                return 
            }
            const user = dbRes.rows[0]
            console.log(user);
            bcrypt.compare(password, user.password_digest, (err, result) => {
                if (result) { 
                    req.session.userId = user.user_id
                    console.log(req.session);
                    res.redirect(`/users/${user.user_id}`)
                } else {
                    req.flash("info", "Incorrect password, please try again")
                    res.redirect("/login")
                }
            });
        })
    }
})

router.delete("/sessions", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
})

module.exports = router