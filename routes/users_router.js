const express = require("express")
const { signup, auth } = require("../serverJS/users")

const router = express.Router()

router.post("/signup", (req, res) => {
    let data = req.body
    signup(data, (e) => {
        if (e.signup) {
            res.cookie("token", e.token)
        }
        res.json(e)
    })
})

router.get("/auth", (req, res) => {
    let token = req.cookies.token
    auth(token, (e) => {
        res.json({ auth: e })
    })
})

module.exports = router
