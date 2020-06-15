const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const cookieParser = require("cookie-parser")

const users_router = require("./routes/users_router")

const app = express()

app.use(logger("dev"))

app.use(express.static("public"))
app.use(
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    cookieParser()
)
app.use("/users", users_router)


module.exports = app
