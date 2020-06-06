const {encryptJSON, decryptJSON} = require("./general")

let data = {
    name: "shekhar"
}

let e = encryptJSON(data)

console.log(e)

console.log(decryptJSON(e))