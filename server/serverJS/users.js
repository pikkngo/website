const db = require("./database")
const { MD5, encryptJSON, decryptJSON } = require("./encryption")
const { generateID } = require("./general")

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
                    db.all(
                        `insert into users values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            generateID(),
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
        [data.username, MD5(data.password)],
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
                            password: data.password,
                        }),
                    })
            }
        }
    )
}
// January 1, 1970 00:00:00

function verify_sid(sid, callback) {
    db.all(`select id, name, username from stores where id=?`, [sid], (err, rows) => {
        if (err) callback({ verify: false, message: "Internal Error" })
        else {
            if (rows.length > 0) {
                let d = {
                    verify: true,
                    data: rows[0],
                }
                //fetching all items
                db.all(`select * from items where sid=?`, [sid], (err, rs) => {
                    d.data.items = rs
                    callback(d)
                })
            } else
                callback({ verify: false, message: "Scan the QR code again" })
        }
    })
}

module.exports = {
    signup,
    signin,
    auth,
    verify_sid,
}
