const db = require("./database")
const { MD5, encryptJSON, decryptJSON } = require("./encryption")
const { generateID } = require("./general")

function authStore(token, callback) {
    let data = decryptJSON(token)
    db.all(
        `select username from stores where username=? and password=?`,
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
        `select * from stores where username=? or mno=? or email=? and password=?`,
        [data.username, data.username, data.username, MD5(data.password)],
        (err, rows) => {
            if (err) callback({ signin: false, message: "Internal Error", err })
            else if (rows.length > 1 || rows.length == 0)
                callback({
                    signin: false,
                    message: "No Store found",
                })
            else {
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

function getAllPendingOrders(sid, callback) {
    let orders
    // [{order_id, order_detail:[item_id, item, quantity, totalPrice, naturalPrice]}]
    db.all(
        `select order_id, uid, description, item_id, name, price, quantity, totalPrice, orders.datetime as datetime, status from orders join order_detail on orders.id=order_detail.order_id join items on items.id=order_detail.item_id where orders.sid=? and orders.status="pending" order by orders.datetime desc`,
        [sid],
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
            delete orders[i].uid
            delete orders[i].status
            parsed[marker - 1].order_detail.push(orders[i])
        } else {
            order_id = orders[i].order_id
            parsed.push({})
            parsed[marker].order_detail = []

            parsed[marker].order_id = order_id
            parsed[marker].uid = orders[i].uid

            parsed[marker].order_detail = []
            parsed[marker].order_detail.push(orders[i])
            parsed[marker].datetime = orders[i].datetime
            parsed[marker].status = orders[i].status
            delete orders[i].order_id
            delete orders[i].datetime
            delete orders[i].status
            delete orders[i].uid
            marker++
        }
    }
    return parsed
}

function cancelOrder(oid, callback) {
    try {
        db.run(`update orders set status="canceled" where id=?`, [oid])
        callback({ canceled: true })
    } catch {
        callback({ canceled: false, message: "Internal Error Try Again" })
    }
}

function confirmOrder(oid, callback) {
    try {
        db.run(`update orders set status="confirmed" where id=?`, [oid])
        callback({ confirmed: true })
    } catch {
        callback({ confirmed: false, message: "Internal Error Try Again" })
    }
}

module.exports = {
    authStore,
    signin,
    getAllPendingOrders,
    cancelOrder,
    confirmOrder,
}
