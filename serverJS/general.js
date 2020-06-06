const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateId() {
    return //something
}
function onWayEncrypt(text) {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(text, salt)
    return hash
}
function compareEncyption(text, hash) {
    return bcrypt.compareSync(text, hash)
}
function encryptJSON(json, callback) {
    const key = 'key'
    return jwt.sign(json, key)
}
function decryptJSON(encoded, callback) {
    const key = 'key'
    return jwt.verify(encoded, key)
}

module.exports = {
    generateId,
    onWayEncrypt,
    compareEncyption,
    encryptJSON,
    decryptJSON,
}
