const db = require("./database")
const { MD5, encryptJSON, decryptJSON } = require("./encryption")
const { generateID } = require("./general")

const webPush = require("web-push")
const { PUSH_PRIVATE, PUSH_PUBLIC } = process.env
webPush.setVapidDetails(
    "mailto:notshekhar@gmail.com",
    PUSH_PUBLIC,
    PUSH_PRIVATE
)

function signup(data, callback) {
    // data = {}

    db.all(
        `select verified from users where username=? or mno=? or email=?`,
        [data.username],
        (err, rows) => {
            if (err)
                callback({
                    signup: false,
                    message: "some internal error, try again",
                })
            else {
                if (rows.length == 1) {
                    callback({
                        signup: false,
                        message: "User already exists",
                    })
                } else {
                    // insert new data user donot exists
                    // (id, fname, lname, username, email, mno, password, datetime, verified)
                    let id = generateID()
                    db.all(
                        `insert into users values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            id,
                            data.fname,
                            data.lname,
                            data.username,
                            data.email,
                            data.mno,
                            MD5(data.password),
                            Date.now(),
                            1,
                        ],
                        (err, e) => {
                            if (err)
                                callback({
                                    signup: false,
                                    message: "Some Internal error",
                                })
                            else
                                callback({
                                    signup: true,
                                    token: encryptJSON({
                                        username: data.username,
                                        password: data.password,
                                    }),
                                    id,
                                })
                        }
                    )
                }
            }
        }
    )
}
//for authantication of users
function auth(token, callback) {
    let data = decryptJSON(token)
    db.all(
        `select username from users where username=? and password=?`,
        [data.username, data.password],
        (err, rows) => {
            if (err) callback(false)
            else if (rows.length == 1) callback(true)
            else callback(false)
        }
    )
}

function signin(data, callback) {
    // data = {username/mobilenumber/email, password}
    db.all(
        `select * from users where username=? or mno=? or email=? and password=?`,
        [data.username, data.username, data.username, MD5(data.password)],
        (err, rows) => {
            if (err) callback({ signin: false, message: "Internal Error", err })
            else if (rows.length > 1 || rows.length == 0)
                callback({
                    signin: false,
                    message: "No user found",
                })
            else {
                if (!rows[0].verified)
                    callback({
                        signin: false,
                        message: "User not verfied try signup again",
                    })
                else
                    callback({
                        signin: true,
                        token: encryptJSON({
                            username: rows[0].username,
                            password: rows[0].password,
                        }),
                        id: rows[0].id,
                    })
            }
        }
    )
}
// January 1, 1970 00:00:00

function verify_sid(sid, callback) {
    db.all(
        `select id, name, username from stores where id=?`,
        [sid],
        (err, rows) => {
            if (err) callback({ verify: false, message: "Internal Error" })
            else {
                if (rows.length > 0) {
                    let d = {
                        verify: true,
                        data: rows[0],
                    }
                    //fetching all images
                    db.all(
                        `select photo from store_photo where sid=?`,
                        [sid],
                        (err, rs) => {
                            console.log(rs)
                            d.data.image = rs[0]
                        }
                    )
                    //fetching all items
                    db.all(
                        `select * from items where sid=?`,
                        [sid],
                        (err, rs) => {
                            d.data.items = rs
                            callback(d)
                        }
                    )
                } else
                    callback({
                        verify: false,
                        message: "Scan the QR code again",
                    })
            }
        }
    )
}

function post_order(data, callback) {
    let order_id = generateID()
    db.all(
        `insert into orders values(?, ?, ?, ?, ?)`,
        [order_id, data.uid, data.sid, "pending", Date.now()],
        (err, rows) => {
            if (!err) {
                for (let item of data.cart) {
                    db.run(
                        `insert into order_detail values(?, ?, ?, ?, ?, ?)`,
                        [
                            generateID(),
                            order_id,
                            item.id,
                            item.quantity,
                            item.price,
                            Date.now(),
                        ]
                    )
                }
                console.log("order_posted")
                callback(true)
            } else {
                callback(false)
            }
        }
    )
}

function getAllPendingOrders(uid, callback) {
    db.all(
        `select order_id, description, item_id, name, price, quantity, totalPrice, orders.datetime as datetime, status from orders join order_detail on orders.id=order_detail.order_id join items on items.id=order_detail.item_id where orders.uid=? and orders.status="pending" order by orders.datetime desc`,
        [uid],
        (err, rs) => {
            callback({ get: true, orders: parseOrders(rs) })
        }
    )
}
function parseOrders(orders) {
    let parsed = []
    let order_id
    let marker = 0
    for (let i = 0; i < orders.length; i++) {
        if (order_id == orders[i].order_id) {
            delete orders[i].order_id
            delete orders[i].datetime
            delete orders[i].status
            parsed[marker - 1].order_detail.push(orders[i])
        } else {
            order_id = orders[i].order_id
            parsed.push({})
            parsed[marker].order_detail = []
            parsed[marker].order_id = order_id
            parsed[marker].order_detail = []
            parsed[marker].order_detail.push(orders[i])
            parsed[marker].datetime = orders[i].datetime
            parsed[marker].status = orders[i].status
            delete orders[i].order_id
            delete orders[i].datetime
            delete orders[i].status

            marker++
        }
    }
    return parsed
}

function getDetail(uid, callback) {
    try {
        db.all(`select fname, lname, mno, username, email from users where id=?`, [uid], (err, rows) => {
            callback({ get: true, data: rows[0] })
        })
    } catch {
        callback({ get: false, message: "Internal Server error" })
    }
}

function sendNotificationToUser(uid, title, body, subscription) {
    try {
        if (subscription) {
            let payload = JSON.stringify({
                title,
                body,
            })

            webPush
                .sendNotification(subscription, payload)
                .catch((error) => console.error(error))
            return
        }
        db.all(
            `select * from notif_subscribe where nid=?`,
            [uid],
            (err, rows) => {
                for (let row of rows) {
                    let payload = JSON.stringify({
                        title,
                        body,
                    })

                    webPush
                        .sendNotification(JSON.parse(row.subscription), payload)
                        .catch((error) => console.error(error))
                }
            }
        )
    } catch {
        return
    }
}

function subscribe(data, callback) {
    let subscription = data.subscription
    try {
        db.all(
            `select endpoint from notif_subscribe where endpoint=?`,
            [subscription.endpoint],
            (err, rows) => {
                if (rows.length == 0) {
                    db.run(
                        `insert into notif_subscribe values(?, ?, ?, ?, ?)`,
                        [
                            generateID(),
                            data.nid,
                            subscription.endpoint,
                            JSON.stringify(subscription),
                            Date.now(),
                        ]
                    )
                    sendNotificationToUser(
                        data.nid,
                        "Subscribed Done",
                        "",
                        subscription
                    )
                }
            }
        )
    } catch {
        sendNotificationToUser(data.nid, "Not Subscribed", "", subscription)
    }
}

module.exports = {
    signup,
    signin,
    auth,
    verify_sid,
    post_order,
    getAllPendingOrders,
    subscribe,
    sendNotificationToUser,
    getDetail,
}
