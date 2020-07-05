function checkAuth() {
    authantication((e) => {
        if (!e.auth) window.location = "/"
        else document.querySelector(".loading").style.display = "none"
    })
}
checkAuth()

function error(text) {
    let er = document.querySelector(".error")
    er.style.display = "block"
    er.innerText = text
    setTimeout(() => {
        er.style.display = "none"
    }, 4000)
}
