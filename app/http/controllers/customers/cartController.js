function cartController() {
    return {
         index(req, res) {
            return res.render('customers/cart') 
        },
        update(req, res) {
             // let cart = { // this is the syntax of the session we will be creating when we will click on the "add" button on the cart section
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {}, //this is the object of the items means various diff pizza will be there
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart //assigning the session in the cart 
             
             // Check if item does not exist in cart 
             if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else { //if item exists then we will be updating the respective things
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })//this is we are sending so that basket which is there in the navbar gets updated
        },
        
    }
}

module.exports = cartController

//completed