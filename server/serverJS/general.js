const { MD5 } = require("./encryption")

function generateID() {
    let s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"
    let randomString = new Array(10)
        .fill(0)
        .map((e) => s[Math.floor(Math.random() * s.length)])
        .join("")
    return MD5(randomString) + MD5("" + Date.now())
}

// console.log(generateID())
module.exports = {
    generateID,
}
