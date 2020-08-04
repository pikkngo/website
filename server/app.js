const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const cookieParser = require("cookie-parser")

const users_router = require("./routes/users_router")
const stores_router = require("./routes/stores_router")

const app = express()

app.use(logger("dev"))
app.use(express.json(), express.urlencoded({ extended: false }), cookieParser())

app.use("/users", users_router)
app.use("/stores", stores_router)

module.exports = app
