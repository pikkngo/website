const db = require("./database")
const { onWayEncrypt, encryptJSON, decryptJSON } = require("./encryption")
const { generateID } = require("./general")

function signup(data, callback) {
    // data = {}

    db.all(
        `select verified from users where username=?`,
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
                            onWayEncrypt(data.password),
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
function auth(token, callback) {
    let data = decryptJSON(token)
    console.log(data)
    db.all(
        `select username from users where username=? and password=?`,
        [data.username, onWayEncrypt(data.password)],
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
        [
            data.username,
            data.username,
            data.username,
            onWayEncrypt(data.password),
        ],
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
                    })
            }
        }
    )
}
// January 1, 1970 00:00:00

function setUserLocation(data, callback) {
    // data = {uid, lat, long, display_address}

    db.all(
        `insert into user_location values(?, ?, ?, ?, ?, ?)`,
        [
            generateID,
            data.uid,
            data.lat,
            data.long,
            data.display_address,
            Date.now(),
        ],
        (err, e) => {
            if (err)
                callback({ location_set: false, message: "Internal Error" })
            else callback({ location_set: true })
        }
    )
}
function getUserLocation(data, callback) {
    // data = {username, uid}
    db.all(
        `select * from user_location where uid=?`,
        [data.uid],
        (err, rows) => {
            if (err) callback({ get: false, message: "Internal Error" })
            else callback({ get: true, data: null })
        }
    )
}

module.exports = {
    signup,
    signin,
    setUserLocation,
    getUserLocation,
    auth,
}
