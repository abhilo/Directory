// THIS IS OUR MAIN SERVER FILE, WE SEPERATED THE ROUTES WITHIN main.js.


require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')
const connectDB = require('./server/config/db');
const session = require('express-session')
const app = express();
const PORT = 3000 || process.env.PORT;


// Middleware

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
  }));


// Connect to the database.
connectDB();





// creates a direct route to our static files which are in public. We can just do http://localhost:3000/public
// if we want to access say the CSS file in a different location, all we need to do is /css/etc/etc.

app.use(express.static('public'));

// Template
app.use(expressLayout);


// can change settings with app.set
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// If you receive a GET request with url = ''
// send back an HTTP response with body 'ok'.
// Just take routes from a different file. 
app.use('/', require('./server/routes/main'));


// seperate route for admin page.
app.use('/', require('./server/routes/admin'));



app.listen(PORT, ()=> {
    console.log(`App listening on port http://localhost:3000`);

});


