//this is the file of javascript for the frontend or whatever we do in frontend
import axios from 'axios' 
import Noty from 'noty' //this is to show the side bar and this feature is no longer supported
import { initAdmin } from './admin' //importing admin.js file in app.js which we created to avoid messup here otherwise the code inside admin.js would have been writtn here
 import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')//including the add-to-cart class from home.ejs into this app.js
let cartCounter = document.querySelector('#cartCounter')//including cardCounter object from layout.ejs which is there in the navbar

function updateCart(pizza) {  //this fn will add the object pizza in the cart
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty // this is to add total no of items in the navbar
        new Noty({  //using noty that is when we will be clicking on the add btn a notification will be shown
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false, //means the time line which is shown at the bottom of the messg
        }).show();
    }).catch(err => {  //this is the catch block of noty means when there is error red bar will be shown
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}

//when button with the pizza card  on the home page is clicked it is activated  
addToCart.forEach((btn) => { 
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza) //converting the string format into JSON object btn.dataset.pizza is the object which contains all the information of that card which we clicked in the frontend and padded by home.ejs
        updateCart(pizza) //calling updateCart methood
    })
})

// Remove alert message after X seconds and this we get from orders.ejs 
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')//getting all the 5 status from singleOrder page
let hiddenInput = document.querySelector('#hiddenInput') //getting the doc of the current order_id from singleOrder from hidden input
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order) //converting string into object
let time = document.createElement('small') //this we are creating <small>tag from html to get append in the tl tag in the singleorder page so that we can get the time

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')//here we are removing both the prev classes and will begin from the beginning to update the real time
        status.classList.remove('current')
    })
    let stepCompleted = true; //making this true    
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed') //adding the step-completed class to the statuses classes
       }
       if(dataProp === order.status) { //checking the ststus in db with the statuses we recieve fron 
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A') //updating time which have to be displayed in singleOrderPge
            status.appendChild(time) //this we are appending time in singleOrder.ejs after the status
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

// Socket
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`) //here we are sending orderid so that we can create a room with this orderid for real time communication
}
//this is so that when we will place the order it will auto matically show in the admin page without refresing which can be done with the help real time
let adminAreaPath = window.location.pathname//getting the full path name
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')//creting the room of join with the roomname as adminRoom and changes will be done in admin.js and also in ordercontroller
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }//copying the order object here which is done by three dots followed by name
    updatedOrder.updatedAt = moment().format()//updating the time with the current time
    updatedOrder.status = data.status//updating the status
    updateStatus(updatedOrder)//calling the above function to execute
    new Noty({ //to show the notification
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
