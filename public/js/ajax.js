function POST(url, data, callback) {
    let options = {
        method: "POST", // or 'PUT'
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
    fetch(url)
        .then((result) => result.json())
        .then((json) => callback(json))
        .catch((err) => callback(err))
}

function authantication(callback) {
    GET("/users/auth", (e) => {
        callback(e)
    })
}
