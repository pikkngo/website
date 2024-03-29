function POST(url, data, callback) {
    let options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    fetch(url, options)
        .then((result) => result.json())
        .then((json) => callback(json))
        .catch((err) => callback(err))
}

function GET(url, callback) {
    fetch(url, { credentials: "include", mode: "cors" })
        .then((result) => result.json())
        .then((json) => callback(json))
        .catch((err) => callback(err))
}

function authantication(callback) {
    GET(
        `${baseURL}/users/auth?user_token=${cookie.getItem("user_token")}`,
        (e) => {
            callback(e)
        }
    )
}
