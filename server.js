const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
var XLSX = require('xlsx');
var multer = require('multer');
var Userdb = require('./server/model/model');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:8080',
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

app.post('/import', upload.single('excel'), (req, res) => {
    // Read the uploaded Excel file
    var workbook = XLSX.readFile(req.file.path);
    // Get the names of all sheets in the workbook
    var sheet_namelist = workbook.SheetNames;
    var x = 0;

    // Iterate over each sheet in the workbook
    sheet_namelist.forEach(element => {
        // Convert the sheet to a JSON object
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
        // Iterate over each row in the sheet
        xlData.forEach(xlD => {
            // Extract the boats information from the "boats" column
            const boatsString = xlD["boats"];
            const boats = boatsString.split(',').map(boatString => {
                if (!boatString) return null; // Ignore empty boat entries
                // Parse each boat entry as a JSON object
                const boat = JSON.parse('{' + boatString + '}');
                // Return the boat object with the keys renamed to match the Userdb schema
                return {
                    mc: boat.mc,
                    boat: boat.boat,
                    color: boat.color
                };
            }).filter(Boolean); // Filter out null values

            // Update the matching Userdb documents with the extracted data
            Userdb.updateMany(
                { name: xlD["name"] },
                {
                    $set: {
                        address: xlD["address"],
                        dues: xlD["dues"],
                        status: xlD["status"],
                        water: xlD["water"],
                        area: xlD["area"],
                        cardNumber: xlD["cardNumber"],
                        cardEnabled: xlD["cardEnabled"],
                        agreement: xlD["agreement"],
                        registration: xlD["registration"],
                    },
                    $push: {
                        boats: { $each: boats }
                    }
                },
                { upsert: true },
                (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                }
            );
        });
        x++;
    });

    res.redirect('/');
});


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
