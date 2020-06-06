const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const cookieParser = require("cookie-parser")

const app = express()

app.use(logger("dev"))

app.use(express.static("public"))

app.use(
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    cookieParser()
)
// app.use()




module.exports = app
