let cart = []
let socket = io(baseURL)
window.socket = socket

function scan() {
    qrReader()
}
scan()
// display_menu()

function qrReader() {
    let menu_wrap = document.querySelector(".menu_wrap")
    // console.log(menu_wrap)
    const codeReader = new ZXing.BrowserQRCodeReader()
    codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
            const firstDeviceId = videoInputDevices[0].deviceId

            codeReader
                .decodeOnceFromVideoDevice(firstDeviceId, "video")
                .then((result) => {
                    //making request to server to know if it is correct qrcode
                    GET(
                        `${baseURL}/users/getStore?sid=${
                            result.text
                        }&user_token=${cookie.getItem("user_token")}`,
                        (e) => {
                            window.store = e.data
                            if (e.verify) {
                                menu_wrap.style.display = "block"
                                display_menu(e.data)
                            } else {
                                qrReader()
                            }
                        }
                    )
                })
        })
        .catch((err) => console.error(err))
}
function display_menu(data) {
    // window.store = {
    //     id: "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
    //     name: "Store Example",
    //     username: "storeExample",
    //     // image:     "data:image/png;base64,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",
    //     items: [
    //         {
    //             id:
    //                 "c2ed4f2c7ae2fe3fbbccdf873c4f1e86510117bcdd6b802a683f5fcd8a1f828d",
    //             sid:
    //                 "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
    //             name: "item1",
    //             description: "description",
    //             price: 100,
    //             datetime: 1593157094601,
    //         },
    //         {
    //             id:
    //                 "1b30ba96dfbb2958dddff22d90d27252efc2241a1b9807cff7b6b29e218e6f3d",
    //             sid:
    //                 "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
    //             name: "item2",
    //             description: "description",
    //             price: 120,
    //             datetime: 1593157095601,
    //         },
    //         {
    //             id:
    //                 "1728f5ad91fa87fbce11f606c22a9a8fb75eb7a1f4658d407379ba376a83efbb",
    //             sid:
    //                 "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
    //             name: "item3",
    //             description: "description",
    //             price: 50,
    //             datetime: 1593157097601,
    //         },
    //     ],
    // }
    // let data = window.store

    let menu_div = document.querySelector(".menu_wrap")
    let header = document.querySelector(".header")
    let menu_body = document.querySelector(".menu_body")
    let add_items = document.querySelector(".add_items")

    menu_div.style.display = "block"
    let store_name_div = el("div", {
        class: "store_name",
        innerText: data.name,
    })

    header.append(store_name_div)
    if (data.image) header.style.backgroundImage = `url(${data.image})`
    for (let item of data.items) {
        let card = createItem(item)
        menu_body.append(card)
    }
}

function checkCartItems(cart, item) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == item.id) {
            return { result: true, i }
        }
    }
    return { result: false }
}

let _view_cart = document.querySelector(".viewCart")
let place_order = document.querySelector(".place_order")

let visible = false
_view_cart.onclick = () => {
    let _cartdiv = document.querySelector(".cartdiv")
    if (!visible) {
        _cartdiv.classList.add("view_cart")
        _cartdiv.classList.remove("hide_view_cart")
        _view_cart.innerText = "Hide Cart"
        visible = !visible
    } else {
        _cartdiv.classList.remove("view_cart")
        _cartdiv.classList.add("hide_view_cart")
        _view_cart.innerText = "View Cart"
        visible = !visible
    }
}

place_order.onclick = () => {
    let data = {
        sid: window.store.id,
        uid: cookie.getItem("uid"),
        cart,
        token: cookie.getItem("user_token"),
    }
    socket.emit("post_order", data)
    // POST(`${baseURL}/users/post_order?user_token=${cookie.getItem("user_token")`, data, (response) => {
    //     console.log(response)
    // })
}
socket.on("place_order_status", (data) => {
    if (data.uid == cookie.getItem("uid")) {
        if (!data.posted) error(data.message)
        else {
            location.hash = "#order"
            console.log("posted")
        }
    }
})

function cartChange() {
    let _cartdiv = document.querySelector(".cartdiv")
    let _totaldiv = document.querySelector(".totalprice")
    let _totalitemsdiv = document.querySelector(".cart_items")

    if (cart.length > 0) {
        //show half cart
        _cartdiv.classList.remove("hide_cart")
        _cartdiv.classList.add("show_cart")

        let total_amount = 0
        let total_items = 0
        for (let item of cart) {
            total_amount += item.price
            total_items += item.quantity
        }
        _totaldiv.innerText = `Rs ${total_amount}`
        _totalitemsdiv.innerText = `${total_items} items`
    } else {
        _cartdiv.classList.remove("show_cart")
        _cartdiv.classList.add("hide_cart")

        //cart also change
        _cartdiv.classList.remove("view_cart")
        _view_cart.innerText = "View Cart"
        visible = !visible
    }
    updateCart()
}

function updateCart() {
    console.log(cart)
    let cart_body = document.querySelector(".cart_body")
    cart_body.innerHTML = ""
    for (let item of cart) {
        let i = createCartItem(item)
        cart_body.append(i)
    }
}

//cart item
function createCartItem(data) {
    let card = el("div", {
        class: "item_card",
    })
    let title = el("div", {
        class: "item_title",
        innerText: data.name,
    })
    let description = el("div", {
        class: "item_description",
        innerText: data.description,
    })
    let price = el("div", {
        class: "item_price",
        innerText: `Rs.${data.price}`,
    })

    let wrap = el("div", {
        class: "wrap_item_quantity",
    })
    let quantity_inp = el("div", {
        class: "q item_q",
        innerText: data.quantity,
    })
    let sub = el("div", {
        class: "q item_q_sub",
        innerText: "-",
        onclick: function () {
            if (parseInt(quantity_inp.textContent) > 1) {
                quantity_inp.textContent =
                    parseInt(quantity_inp.textContent) - 1
                for (let item of cart) {
                    if (item.id == data.id) {
                        item.quantity = parseInt(quantity_inp.textContent)
                        item.price = item.quantity * data.naturalPrice
                    }
                }
            }
        },
    })
    let add = el("div", {
        class: "q item_q_add",
        innerText: "+",
        onclick: function () {
            quantity_inp.textContent = parseInt(quantity_inp.textContent) + 1
            for (let item of cart) {
                if (item.id == data.id) {
                    item.quantity = parseInt(quantity_inp.textContent)
                    item.price = item.quantity * data.naturalPrice
                }
            }
            console.log(cart)
        },
    })
    wrap.append(sub, quantity_inp, add)
    let remove_btn = el("button", {
        class: "item_remove",
        id: data.id,
        innerText: "Remove Item",
        onclick: function () {
            cart = cart.filter((e) => e.id != this.id)
            cartChange()
        },
    })
    card.append(title, description, price, wrap, remove_btn)
    return card
}

//menu item
function createItem(data) {
    // data = {title, description, price, id}
    let card = el("div", {
        class: "item_card",
    })

    let title = el("div", {
        class: "item_title",
        innerText: data.name,
    })
    let description = el("div", {
        class: "item_description",
        innerText: data.description,
    })
    let price = el("div", {
        class: "item_price",
        innerText: `Rs.${data.price}`,
    })
    let wrap = el("div", {
        class: "wrap_item_quantity",
    })
    let quantity_inp = el("div", {
        class: "q item_q",
        innerText: 1,
    })
    let sub = el("div", {
        class: "q item_q_sub",
        innerText: "-",
        onclick: function () {
            if (parseInt(quantity_inp.textContent) > 1)
                quantity_inp.textContent =
                    parseInt(quantity_inp.textContent) - 1
        },
    })
    let add = el("div", {
        class: "q item_q_add",
        innerText: "+",
        onclick: function () {
            quantity_inp.textContent = parseInt(quantity_inp.textContent) + 1
        },
    })
    wrap.append(sub, quantity_inp, add)

    let add_btn = el("button", {
        class: "item_add",
        innerText: "Add Item",
        onclick: function () {
            let q = parseInt(quantity_inp.textContent)
            let item = {
                id: data.id,
                quantity: q,
                naturalPrice: data.price,
                price: q * data.price,
                name: data.name,
                description: data.description,
            }
            let _checkcart = checkCartItems(cart, item)
            if (_checkcart.result) {
                cart[_checkcart.i].quantity += item.quantity
                cart[_checkcart.i].price += item.price
            } else {
                cart.push(item)
            }
            cartChange()
        },
    })

    let _icon = el("div", { class: "item_icon" })
    let _wrap = el("div", { class: "details_wrap" })
    let _wrap1 = el("div", { class: "sdsdsdsd" })

    _wrap1.append(price, wrap, add_btn)
    _wrap.append(title, description, _wrap1)
    card.append(_icon, _wrap)
    return card
}
