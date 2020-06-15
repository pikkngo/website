const { encryptJSON, decryptJSON } = require("./encryption")
const { pre_signup, signin } = require("./users")

const db = require("./database")


let data = {
    fname: "Shkehar",
    lname: "TYgai",
    password: "shekhar",
    username: "notshekhar",
    email: "notshekhar@gmail.com",
    mno: 9027760089,
}

pre_signup(data, (e) => {
    console.log(e)
})

// signin({ username: "notshekhar", password: "shekhar" }, (data) => {
//     console.log(data)
// })

