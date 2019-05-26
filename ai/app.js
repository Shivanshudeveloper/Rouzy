const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')

// Creating a express app
const app = express()
// Passport Config
require('./config/passport')(passport)
// DB Connection
const db = require('./config/keys').MongoURI
// Connect MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then( () => console.log('MongoDB Connected') )
    .catch(err => console.log(err))

// EJS Middle Layer
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }) )

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


// PORT
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log('Server Started On Port', PORT))