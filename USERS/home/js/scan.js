function scan() {
    qrReader()
    console.log("okay")
    display_menu()
}
scan()

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
                    GET(`${baseURL}/users/getStore?sid=${result.text}`, (e) => {
                        console.log(JSON.stringify(e.data))
                        if (e.verify) {
                            menu_wrap.style.display = "block"
                            display_menu(e.data)
                        } else {
                            qrReader()
                        }
                    })
                })
        })
        .catch((err) => console.error(err))
}
function display_menu() {
    let data = {
        id: "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
        name: "Store Example",
        username: "storeExample",
        // image: "../../",
        items: [
            {
                id:
                    "c2ed4f2c7ae2fe3fbbccdf873c4f1e86510117bcdd6b802a683f5fcd8a1f828d",
                sid:
                    "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
                name: "item1",
                description: "description",
                price: 100,
                datetime: 1593157094601,
            },
            {
                id:
                    "1b30ba96dfbb2958dddff22d90d27252efc2241a1b9807cff7b6b29e218e6f3d",
                sid:
                    "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
                name: "item2",
                description: "description",
                price: 120,
                datetime: 1593157095601,
            },
            {
                id:
                    "1728f5ad91fa87fbce11f606c22a9a8fb75eb7a1f4658d407379ba376a83efbb",
                sid:
                    "08f5f2af2392f5c9d49d5a3356bd67906326f56c04b679dfdbb37fa26632b3fd",
                name: "item3",
                description: "description",
                price: 50,
                datetime: 1593157097601,
            },
        ],
    }
    console.log(data)
    let header = document.querySelector(".header")
    let menu_body = document.querySelector(".menu_body")
    let add_items = document.querySelector(".add_items")
    let cart = []

    let store_name_div = el("div", {
        class: "store_name",
        innerText: data.name,
    })

    header.append(store_name_div)
    if(data.image) header.style.backgroundImage = `url(${data.image})` 
    for (let item of data.items) {
        let card = createItemCard(item)
        menu_body.append(card)
    }
}

function createItemCard(data) {
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
    let sub = el("button", {
        class: "item_q_sub",
        innerText: "-",
    })
    let quantity_inp = el("input", {
        class: "item_q",
        value: 0,
    })
    let add = el("button", {
        class: "item_q_add",
        innerText: "+",
    })
    wrap.append(sub, quantity_inp, add)
    let add_btn = el("button", {
        class: "item_add",
        id: data.id,
        innerText: "Add Item",
    })
    let _icon = el("div", { class: "item_icon" })
    let _wrap = el("div", { class: "details_wrap" })
    let _wrap1 = el("div", { class: "sdsdsdsd" })

    _wrap1.append(price, wrap, add_btn)
    _wrap.append(title, description, _wrap1)
    card.append(_icon, _wrap)
    return card
}
