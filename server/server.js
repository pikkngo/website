const app = require("./app")

require("dotenv").config()

const server = app.listen(process.env.PORT, () => {
    console.log(`listining at port ${process.env.PORT}`)
})
