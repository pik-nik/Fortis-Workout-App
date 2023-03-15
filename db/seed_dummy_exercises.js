const db = require("./../db")

let exercises = [
    "AB WHEEL ROLLOUTS",
    "BACK RAISE",
    "BACK SQUAT",
    "BARBELL ROW",
    "BARBELL SPLIT SQUAT",
    "BENCH PRESS",
    "BOX SQUAT",
    "BULGARIAN SPLIT SQUAT",
    "CABLE PULL THROUGH",
    "CHEST SUPPORTED ROWS",
    "CONVENTIONAL BARBELL DEADLIFT",
    "DIPS",
    "DUMBBELL INCLINE PRESS",
    "DUMBBELL OVERHEAD PRESS",
    "DUMBBELL PRESS",
    "DUMBBELL RDL",
    "DUMBBELL ROWS",
    "FACE PULLS",
    "FRONT RACK REVERSE LUNGE",
    "FRONT SQUAT",
    "GOODMORNING",
    "HORIZONTAL PULL-UPS",
    "INCLINE BENCH PRESS",
    "KETTLE BELL SWINGS",
    "LAT PULLDOWNS",
    "LEG RAISES",
    "OVERHEAD PRESS",
    "PAUSE SQUAT",
    "PISTOLS",
    "PLANK VARIATIONS",
    "POWER CLEANS",
    "PULL-UPS/CHIN-UPS",
    "PUSH-UPS",
    "REVERSE CRUNCH",
    "ROMANIAN DEADLIFT",
    "SAFETY BAR SQUATS",
    "SEATED CABLE ROWS",
    "SIDE PLANKS",
    "STEP UPS",
    "SUMO DEADLIFT",
    "THE GOBLET SQUAT",
    "THE SUIT CASE DEADLIFT",
    "THRUSTERS",
    "TRAP BAR DEADLIFT",
    "UNDERHAND EZ BAR ROW",
    "WALL SITS",
    "WEIGHTED CARRIES"
]

for (let i = 0; i < exercises.length; i++) {
    const sql = "INSERT INTO exercises (name) VALUES ($1);"
    db.query(sql, [exercises[i]], (err, dbRes) => {
    })
}

// consider grouping by exercise types in future
//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select