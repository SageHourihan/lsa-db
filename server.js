const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://lsa-db.fly.dev',
    clientID: '6hZk70Nnk8r8OnSshgTyh8WzZaVKVSyC',
    issuerBaseURL: 'https://dev-dzv70nbk.us.auth0.com'
};

const connectDB = require('./server/database/connection');

const app = express();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// load routers
app.use('/', require('./server/routes/router'))

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
