//this is the file of javascript for the frontend or whatever we do in frontend
import axios from 'axios' 
import Noty from 'noty' //this is to show the side bar and this feature is no longer supported

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