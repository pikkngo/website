const express = require("express")
const cors = require("cors")

const { signup, auth, signin, verify_sid } = require("../serverJS/users")

const router = express.Router()

router.use(
    cors({
        origin: "http://192.168.43.41:5500",
        credentials: true,
    })
)

router.post("/signup", (req, res) => {
    let data = req.body
    signup(data, (e) => {
        if (e.signup) res.cookie("token", e.token, { sameSite: "None" })
        res.json(e)
    })
})

router.get("/auth", (req, res) => {
    let token = req.cookies.token
    if (token)
        auth(token, (e) => {
            res.json({ auth: e })
        })
    else res.json({ auth: false })
})

router.post("/login", (req, res) => {
    let data = req.body
    signin(data, (e) => {
        if (e.signin) res.cookie("token", e.token, { sameSite: "None" })
        res.json(e)
    })
})
router.get("/getStore", (req, res) => {
    let sid = req.query.sid
    let token = req.cookies.token
    if (sid) {
        auth(token, (e) => {
            if (e) {
                verify_sid(sid, (r) => {
                    res.json(r)
                })
            } else {
                res.json({ verify: false, message: "Try to relogin" })
            }
        })
    } else {
        res.json({ verify: false, message: "Rescan QR code" })
    }
})

module.exports = router
