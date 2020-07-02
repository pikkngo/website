;(function () {
    const root = document.querySelector(".root")

    let preCache = {}

    function _fetch(url, callback) {
        fetch(url)
            .then((d) => d.text())
            .then((html) => {
                callback(html)
            })
            .catch((err) => console.log(err))
    }
    function get_content(tag) {
        root.innerHTML = ""
        if (!preCache[tag]) {
            _fetch(`views/${tag}.html`, (html) => {
                root.insertAdjacentHTML("beforeend", html)
                preCache[tag] = {}
                preCache[tag].html = html
            })
            _fetch(`./js/${tag}.js`, (js) => {
                eval(js)
                preCache[tag].js = js
            })
        } else {
            root.insertAdjacentHTML("beforeend", preCache[tag].html)
            eval(preCache[tag].js)
        }
    }

    function changeRoute() {
        if (!location.hash) location.hash = "#scan"
        let hash = location.hash
        let tag = hash.slice(1)
        get_content(tag)
    }

    changeRoute()
    window.addEventListener("hashchange", changeRoute)
})()
