const express = require("express")
const app = express()
const port = process.env.PORT || 8080
const expressLayouts = require("express-ejs-layouts")

const methodOverride = require("./middlewares/method_override")

const workoutController = require("./controllers/workout_controller")

app.set("view engine", "ejs")

app.use(expressLayouts)
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride)

app.use(workoutController)

app.listen(port, () => {
    console.log(`listenting on port ${port}`);
})