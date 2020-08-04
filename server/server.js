const socket = require("socket.io")
const fs = require("fs")
const https = require("https")

const { auth, post_order } = require("./serverJS/users")
const {
    authStore,
    getAllPendingOrders,
    cancelOrder,
    confirmOrder,
} = require("./serverJS/stores")

const app = require("./app")

require("dotenv").config()

const privateKey = fs.readFileSync("./https/localhost.key")
const certificate = fs.readFileSync("./https/localhost.cert")

const secure = https
    .createServer({ key: privateKey, cert: certificate }, app)
    .listen(process.env.SECURE_PORT, () => {
        console.log(`listining at port ${process.env.SECURE_PORT} secure`)
    })

const server = app.listen(process.env.PORT, () => {
    console.log(`listining at port ${process.env.PORT}`)
})

//

const io = socket(server)
io.on("connection", (s) => {
    s.on("join_room", (id) => {
        s.join(id)
        console.log(`${id} joined the room`, id)
    })
    s.on("post_order", (data) => {
        let token = data.token
        console.log("data", token)
        auth(token, (e) => {
            if (e) {
                post_order(data, (r) => {
                    if (r) {
                        s.emit("place_order_status", {
                            uid: data.uid,
                            posted: r,
                        })
                        getAllPendingOrders(data.sid, (rows) => {
                            let d = {
                                ...rows,
                                ...{
                                    sid: data.sid,
                                },
                            }
                            s.to(data.sid).broadcast.emit("new_order", d)
                        })
                    } else
                        s.emit("place_order_status", {
                            uid: data.uid,
                            posted: false,
                            message: "Some Internal Error",
                        })
                })
            } else {
                s.emit("place_order_status", {
                    uid: data.uid,
                    posted: false,
                    message: "Try login again",
                })
            }
        })
    })

    //on order cancel from store
    s.on("order_cancel_store", (data) => {
        let { store_token, order_id, uid, sid } = data
        authStore(store_token, (e) => {
            if (e) {
                cancelOrder(order_id, (res) => {
                    s.to(uid).broadcast.emit("order_canceled_store", res)
                    s.emit("order_cancel_status", res)
                })
            } else {
                s.emit("order_cancel_status", {
                    canceled: false,
                    message: "Try to relogin",
                })
            }
        })
    })
    //on order cancel from store
    s.on("order_confirm_store", (data) => {
        console.log("okay")
        let { store_token, order_id, uid, sid } = data
        authStore(store_token, (e) => {
            if (e) {
                confirmOrder(order_id, (res) => {
                    s.to(uid).broadcast.emit("order_confirmed_store", res)
                    s.emit("order_confirm_status", res)
                })
            } else {
                s.emit("order_confirm_status", {
                    confirmed: false,
                    message: "Try to relogin",
                })
            }
        })
    })
    //end
})
