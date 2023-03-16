const express = require("express")
const app = express()
const port = process.env.PORT || 8080
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const MemoryStore = require('memorystore')(session)

const setCurrentUser = require("./middlewares/setCurrentUser")
const viewHelpers = require("./middlewares/view_helpers")
// const methodOverride = require("./middlewares/method_override")
const methodOverride = require("method-override")
const upload = require("./middlewares/upload")
const ensureLoggedIn = require("./middlewares/ensure_logged_in")

const workoutController = require("./controllers/workout_controller")
const userController = require("./controllers/user_controller")
const sessionController = require("./controllers/session_controller")

app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
// app.use(methodOverride)
app.use(expressLayouts)
app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new MemoryStore({
        checkPeriod: 86400000,
      }),
      secret: process.env.SESSION_SECRET || "mistyrose",
      resave: false,
      saveUninitialized: true,
    })
  )

app.use(setCurrentUser) 
app.use(viewHelpers)

app.use(workoutController)
app.use(userController)
app.use(sessionController)

app.listen(port, () => {
    console.log(`listenting on port ${port}`);
})