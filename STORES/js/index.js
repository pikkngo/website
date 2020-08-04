function error(text) {
    let er = document.querySelector(".error")
    er.style.display = "block"
    er.innerText = text
    setTimeout(() => {
        er.style.display = "none"
    }, 4000)
}
