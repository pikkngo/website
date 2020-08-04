authantication((e) => {
    console.log(e)
    if (e.auth) {
        document.querySelector(".loading").style.display = "none"
    } else {
        window.location = "/"
    }
})

function error(text) {
    let er = document.querySelector(".error")
    er.style.display = "block"
    er.innerText = text
    setTimeout(() => {
        er.style.display = "none"
    }, 4000)
}
