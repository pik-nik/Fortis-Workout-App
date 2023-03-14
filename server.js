const express = require("express")
const app = express()
const port = process.env.PORT || 8080
const expressLayouts = require("express-ejs-layouts")

const trainingController = require("./controllers/training_controller")

app.set("view engine", "ejs")

app.use(expressLayouts)
app.use(express.static("public"))

app.use(trainingController)

app.listen(port, () => {
    console.log(`listenting on port ${port}`);
})