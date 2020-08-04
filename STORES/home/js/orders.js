let wrap = document.querySelector(".wrap")

function allPendingOrders() {
    GET(
        `${baseURL}/stores/getAllPendingOrders?sid=${cookie.getItem(
            "sid"
        )}&store_token=${cookie.getItem("store_token")}`,
        (data) => {
            if (data.get) {
                console.log(data)
                wrap.innerHTML = ""
                if (data.orders.length == 0) {
                    //habdle for not data
                    wrap.innerHTML = `<h1>Sorry no order for now</h1>`
                }
                for (let order of data.orders) {
                    let card = createOrderCard(order)
                    wrap.append(card)
                }
            } else {
                error(data.message)
            }
        }
    )
}
allPendingOrders()

socket.on("new_order", (data) => {
    if (data.sid == cookie.getItem("sid")) {
        wrap.innerHTML = ""
        for (let order of data.orders) {
            let card = createOrderCard(order)
            wrap.append(card)
        }
    }
})

//if order is canceled or not
socket.on("order_cancel_status", (response) => {
    if (response.canceled) {
        allPendingOrders()
    } else {
        error(response.message)
    }
})
// if order is confirmed or not
socket.on("order_confirm_status", (response) => {
    if (response.confirmed) {
        allPendingOrders()
    } else {
        error(response.message)
    }
})

function createOrderCard(order) {
    let totalCartPrice = 0
    for (let o of order.order_detail) {
        totalCartPrice += o.totalPrice
    }

    let card = el("div", {
        class: "order_card",
    })
    let card_header = el("div", {
        class: "cardHeader",
    })
    let orderId = el("div", {
        class: "order_id",
        innerText: `Order Id: #${order.order_id.slice(0, 11)}....`,
    })
    card_header.append(orderId)

    let bottom_header = el("div", {
        class: "bottomHeader",
    })
    let totalP = el("div", {
        class: "totalPrice",
        innerText: `Rs. ${totalCartPrice}`,
    })
    let expand = el("button", {
        class: "expand",
        innerHTML: "Expand",
    })
    bottom_header.append(totalP, expand)

    let card_body = el("div", {
        class: "cardBody",
    })
    for (let item of order.order_detail) {
        let item_card = el("div", {
            class: "item_card",
        })
        let item_name = el("div", {
            class: "item_name",
            innerText: item.name,
        })
        let item_quantity = el("div", {
            class: "quantity",
            innerText: item.quantity,
        })
        let item_total_price = el("div", {
            class: "item_total_price",
            innerText: item.totalPrice,
        })
        item_card.append(item_name, item_quantity, item_total_price)
        card_body.append(item_card)
    }

    let card_footer = el("div", {
        class: "cardFooter",
    })
    let cancel = el("button", {
        class: "cancel",
        innerHTML: "Cancel",
        onclick: () => {
            socket.emit("order_cancel_store", {
                sid: cookie.getItem("sid"),
                store_token: cookie.getItem("store_token"),
                order_id: order.order_id,
                uid: order.uid,
            })
            // GET(
            //     `${baseURL}/stores/cancelOrder?order_id=${
            //         order.order_id
            //     }&store_token=${cookie.getItem("store_token")}`,
            //     (data) => {
            //         if (data.canceled) {
            //             allPendingOrders()
            //         } else {
            //             error("Can't cancel try anain")
            //         }
            //     }
            // )
        },
    })

    let confirm = el("button", {
        class: "confirm",
        innerHTML: "Confirm",
        onclick: () => {
            socket.emit("order_confirm_store", {
                sid: cookie.getItem("sid"),
                store_token: cookie.getItem("store_token"),
                order_id: order.order_id,
                uid: order.uid,
            })
            // GET(
            //     `${baseURL}/stores/confirmOrder?order_id=${
            //         order.order_id
            //     }&store_token=${cookie.getItem("store_token")}`,
            //     (data) => {
            //         if (data.confirm) {
            //             allPendingOrders()
            //         } else {
            //             error("Can't Confirm try anain")
            //         }
            //     }
            // )
        },
    })
    card_footer.append(cancel, confirm)

    card.append(card_header, bottom_header, card_body, card_footer)
    return card
}
