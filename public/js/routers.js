;(function () {
    const root = document.querySelector(".root")

    let preCache = {}

    function fetch_html(url, callback) {
        fetch(url)
            .then((d) => d.text())
            .then((html) => {
                callback(html)
            })
    }
    function get_content(tag) {
        let e = document.createElement("div")
        root.innerHTML = ""
        if (!preCache[tag]) {
            fetch_html(`/views/${tag}.html`, (html) => {
                root.insertAdjacentHTML("beforeend", html)
                preCache[tag] = html
            })
        } else {
            root.insertAdjacentHTML("beforeend", preCache[tag])
        }
    }

    function changeRoute() {
        if (!location.hash) location.hash = "#first"
        let hash = location.hash
        let tag = hash.slice(1)
        get_content(tag)
    }

    changeRoute()
    window.addEventListener("hashchange", changeRoute)
})()
