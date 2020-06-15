const { MD5 } = require("./encryption")

function generateID() {
    let s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"
    let randomString = ""
    for (let i = 0; i < 10; i++) {
        randomString += s[Math.floor(Math.random() * s.length)]
    }
    return MD5(randomString) + MD5("" + Date.now())
}

module.exports = {
    generateID,
}
