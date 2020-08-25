let username_div = document.querySelector(".username")
let name_div = document.querySelector(".name")
let mobile_div = document.querySelector(".mobile")
let email_div = document.querySelector(".email")

function setDetails(data) {
    if (data) {
        name_div.innerText = `${data.fname} ${data.lname}`
        mobile_div.innerText = `+91 ${data.mno}`
        email_div.innerText = `${data.email}`
        username_div.innerText = `@${data.username}`
    } else {
        error("Something went wrong")
    }
}
function fetch_details() {
    GET(
        `${baseURL}/users/account_details?uid=${cookie.getItem(
            "uid"
        )}&user_token=${cookie.getItem("user_token")}`,
        (data) => {
            if (data.get) {
                console.log(data.data)
                localStorage.setItem("user_detail", JSON.stringify(data.data))
                console.log("updated locally")
            } else {
                error(data.message)
            }
        }
    )
}

if (localStorage.getItem("user_detail")) {
    setDetails(JSON.parse(localStorage.getItem("user_detail")))
    fetch_details()
} else {
    fetch_details()
    setDetails(JSON.parse(localStorage.getItem("user_detail")))
}

let edit = document.querySelector(".edit")
let edit_div = document.querySelector(".edit_details")
let cancel = document.querySelector(".cancel")

edit.onclick = () => {
    edit_div.classList.remove("hide_edit_animation")
    edit_div.classList.add("show_edit_animation")
}
cancel.onclick = () => {
    edit_div.classList.remove("show_edit_animation")
    edit_div.classList.add("hide_edit_animation")
}
