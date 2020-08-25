const express = require("express")
const cors = require("cors")

const {
    signup,
    auth,
    signin,
    verify_sid,
    post_order,
    getAllPendingOrders,
    subscribe,
    getDetail,
} = require("../serverJS/users")

const router = express.Router()

router.use(
    cors({
        origin: "http://127.0.0.1:5500",
        // origin: "http://192.168.43.41:5500",
        credentials: true,
    })
)

router.post("/signup", (req, res) => {
    let data = req.body
    signup(data, (e) => {
        // if (e.signup) res.cookie("token", e.token, { sameSite: "None" })
        res.json(e)
    })
})

router.get("/auth", (req, res) => {
    let token = req.query.user_token
    console.log(token)
    if (token)
        auth(token, (e) => {
            res.json({ auth: e })
        })
    else res.json({ auth: false })
})

router.post("/login", (req, res) => {
    let data = req.body
    signin(data, (e) => {
        // if (e.signin) res.cookie("token", e.token, { sameSite: "None" })
        res.json(e)
    })
})
router.get("/getStore", (req, res) => {
    let sid = req.query.sid
    let token = req.query.user_token
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
router.post("/post_order", (req, res) => {
    let order = req.body
    let token = req.query.user_token
    auth(token, (e) => {
        if (e) {
            post_order(order, (r) => {
                if (r) res.json({ posted: r })
                else res.json({ posted: false, message: "Some Internal Error" })
            })
        } else {
            res.json({ posted: false, message: "Try to relogin" })
        }
    })
})

router.get("/getAllPendingOrders", (req, res) => {
    let { uid, user_token } = req.query
    auth(user_token, (e) => {
        if (e) {
            getAllPendingOrders(uid, (data) => {
                res.json(data)
            })
        } else {
            res.json({ get: false, message: "Try to relogin" })
        }
    })
})
router.get("/account_details", (req, res) => {
    let { uid, user_token } = req.query
    auth(user_token, (e) => {
        if (e) {
            getDetail(uid, (data) => {
                res.json(data)
            })
        } else {
            res.json({
                get: false,
                message: "Try relogin",
            })
        }
    })
})
router.post("/subscribe", (req, res) => {
    let data = req.body
    subscribe(data)
    res.status(201).json({})
})

module.exports = router
