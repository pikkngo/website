;(function () {
    const root = document.querySelector(".root")
    root.addEventListener("DOMSubtreeModified", dosomething)

    function dosomething() {
        let top = document.querySelector(".top")

        console.log(top)
    }
})()
