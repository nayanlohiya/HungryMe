//i have removed poduction script with now given production
require('dotenv').config()  //using this so that we can use .env file in this file
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose') //including mongoose
const session = require('express-session')//requring session which uses cookies
const flash = require('express-flash') //this is to store session id in the cookies and is send along with req and also used to display meaasge
const MongoDbStore = require('connect-mongo')  //used to store sesion id in the data base for the time we have mentioned in max life in the syntax
const passport = require('passport')//for verification and used using login time
const Emitter = require('events')//for real time communication used to that we can emit changes 

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

// Session store  this is for old version 
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

// Event emitter
const eventEmitter = new Emitter() //declaring the instance of it
app.set('eventEmitter', eventEmitter)//here we are combining emitter with exprees so that we can use it in ststuscontroller.js in admin folder 
//first is the name which we are declaring and it should be same across all


// Session configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL //syntax of nre version i.e of version ^4
    }), //storing the sessions in the database otherwise it would be stored in the memory
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
//passport ka configuartion should be after the session  otherwiss it wont work
// Passport config and using seperate file for doing everything
const passportInit = require('./app/config/passport')
passportInit(passport) //sending passport object to the passport.js file so that we can use there
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())//using flash
//assets
app.use(express.static('public')) //this is used to tell the server that we have use public as static(means data will go into public folder from resources folder) this is basically to include the css if not then css will not be included with html in home.ejs
app.use(express.urlencoded({ extended: false }))//to recieve url encodeded data from the client when we register and click on submit button
app.use(express.json()) //this is so that server can read json which it cannot read till this command is not given

// Global middleware--- this is to allow session and user from the backend to be used in the frontend that is in app.js file and layout.ejs file for the user
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// set Template engine and this part is to be included before  get requests as we are using layout function on the get req pages
app.use(expressLayout)  //here we are using ejs which is used to display html using server side 
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')




// we have moved all the requests to web.js so  express object->app will be required there so we have used this syntax 
require('./routes/web')(app)
app.use((req, res) => {//if the route does not match then it will render this page
    res.status(404).render('errors/404')
})

 const server=app.listen(PORT , () => {
            console.log(`Listening on port ${PORT}`)
        })

// Socket

const io = require('socket.io')(server)//same server which we declared above
io.on('connection', (socket) => { //here we are making connection with the browser
    // Join
    socket.on('join', (orderId) => { //here we are recieving orderid from client app.js file to emit the changes there
      socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => { //recieving the orderUpdated name from adminfolder
  io.to(`order_${data.id}`).emit('orderUpdated', data)//here we are emitting data that we have we have recieved from statuscontroller to the private room which we created using order_id
})

eventEmitter.on('orderPlaced', (data) => { //from the ordercontroller
  io.to('adminRoom').emit('orderPlaced', data)
})