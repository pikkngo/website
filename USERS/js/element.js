function el(e, attrs) {
    let el = document.createElement(e)
    for (let attr in attrs) {
        const value = attrs[attr]
        if (attr == "innerText") el.innerText = value
        else if (attr == "innerHTML") el.innerHTML = value
        else if (/on\w+/.test(attr)) el.addEventListener(attr.slice(2), value)
        else el.setAttribute(attr, value)
    }
    return el
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this)
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i])
        }
    }
}
