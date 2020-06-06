const sqlite = require("sqlite3").verbose()
const { generateID, onWayEncrypt } = require("./general")

const db = new sqlite.Database("./database/users.db")
db.serialize(() => {
    db.run(
        " CREATE TABLE IF NOT EXISTS users (id text, fname text, lname text, username text, email text, mno number, password text, datetime number, verified number)"
    )
    console.log('Database "users" ready to go!')
})

function pre_signup(data, callback) {
    db.all(
        `select verified from users where username=?`[data.username],
        (err, rows) => {
            if (err)
                callback({
                    pre_signup: false,
                    message: "some internal error, try again",
                })
            else {
                if (rows.length == 1) {
                    if (rows[0] == 1) {
                        callback({
                            pre_signup: false,
                            message: "User already exists",
                        })
                    } else {
                        //do update data in database
                        db.all()
                    }
                } else {
                    // insert new data user donot exists
                    // (id, fname, lname, username, email, mno, password, datetime, verified)
                    db.all(
                        `insert into users values(?, ?, ?, ?, ?)`,
                        [
                            generateId(),
                            data.fname,
                            data.lname,
                            data.username,
                            data.email,
                            data.mno,
                            onWayEncrypt(data.password),
                            Date.now(),
                            0,
                        ],
                        (err, data) => {
                            if (err)
                                callback({
                                    pre_signup: false,
                                    message: "SomeInternal error",
                                })
                            else
                            console.log('okay')
                                callback({
                                    pre_signup: true,
                                    token: encryptJSON(data),
                                })  
                        }
                    )
                }
            }
        }
    )
}
function signup(data, callback) {}

module.exports = {
    pre_signup,
    signup,
}
