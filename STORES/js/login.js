authantication((e) => {
    console.log(e)
    if (e.auth) {
        window.location = "/home"
    } else {
        document.querySelector(".loading").style.display = "none"
    }
})

let username = document.querySelector(".username")
let password = document.querySelector(".password")
let signin_btn = document.querySelector(".login_submit")

signin_btn.onclick = () => {
    console.log("okay")
    window.data = {
        username: username.value || 0,
        password: password.value || 0,
    }
    let tf = false
    for (let d in window.data) {
        if (window.data[d] == 0) {
            tf = true
            break
        }
    }
    if (!tf) {
        POST(`${baseURL}/stores/login`, window.data, (e) => {
            if (e.signin) {
                cookie.setItem("store_token", e.token)
                cookie.setItem("sid", e.id)
                location.href = "/home"
            } else error(e.message)
        })
    } else error("Can't leave any field empty")
}
