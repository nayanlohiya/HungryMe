require('dotenv').config()  //using this so that we can use .env file in this file
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose') //including mongoose
const session = require('express-session')//requring session which uses cookies
const flash = require('express-flash') //this is to store session id in the cookies and is send along with req
const MongoDbStore = require('connect-mongo')  //used to store sesion id in the data base for the time we have mentioned in max life in the syntax


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

app.use(flash())//using flash
//assets
app.use(express.static('public')) //this is used to tell the server that we have use public as static(means data will go into public folder from resources folder) this is basically to include the css if not then css will not be included with html in home.ejs
app.use(express.json()) //this is so that server can read json which it cannot read till this command is not given

// Global middleware--- this is to allow session to be used in the frontend that is in app.js file
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

 app.listen(PORT , () => {
            console.log(`Listening on port ${PORT}`)
        })
