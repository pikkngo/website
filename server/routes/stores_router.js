const express = require("express")
const cors = require("cors")
const router = express.Router()

const {
    authStore,
    signin,
    getAllPendingOrders,
    cancelOrder,
    confirmOrder,
    getDetail,
    subscribe,
} = require("../serverJS/stores")

router.use(
    cors({
        origin: "http://127.0.0.1:5501",
        credentials: true,
    })
)

router.post("/login", (req, res) => {
    let data = req.body
    signin(data, (e) => {
        if (e.signin) res.cookie("token", e.token, { sameSite: "None" })
        res.json(e)
    })
})
router.get("/auth", (req, res) => {
    let token = req.query.store_token
    if (token)
        authStore(token, (e) => {
            res.json({ auth: e })
        })
    else res.json({ auth: false })
})

router.get("/getAllPendingOrders", (req, res) => {
    let token = req.query.store_token
    let sid = req.query.sid
    authStore(token, (e) => {
        if (e) {
            getAllPendingOrders(sid, (data) => {
                res.json(data)
            })
        } else {
            res.json({ get: false, message: "Try to relogin" })
        }
    })
})

router.get("/cancelOrder", (req, res) => {
    let { store_token, order_id } = req.query
    authStore(store_token, (e) => {
        if (e) {
            cancelOrder(order_id, (data) => {
                res.json(data)
            })
        } else {
            res.json({ get: false, message: "Try to relogin" })
        }
    })
})
router.get("/confirmOrder", (req, res) => {
    let { store_token, order_id } = req.query
    authStore(store_token, (e) => {
        if (e) {
            confirmOrder(order_id, (data) => {
                res.json(data)
            })
        } else {
            res.json({ get: false, message: "Try to relogin" })
        }
    })
})
router.get("/account_details", (req, res) => {
    let { sid, store_token } = req.query
    authStore(store_token, (e) => {
        if (e) {
            getDetail(sid, (data) => {
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
