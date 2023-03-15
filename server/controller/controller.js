var Userdb = require('../model/model');
var XLSX = require('xlsx');
var path = require('path');
var fs = require('fs');
const connectDb = require('../database/connection')

// create and save new user
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    // const user = new Userdb({
    //     name: req.body.name,
    //     address: req.body.address,
    //     dues: req.body.dues,
    //     status: req.body.status,
    //     water: req.body.water,
    //     area: req.body.area,
    //     cardNumber: req.body.cardNumber,
    //     cardEnabled: req.body.cardEnabled,
    //     agreement: req.body.agreement,
    //     registration: req.body.registration,
    //     wc1: req.body.wc1,
    //     mc1Num: req.body.mc1Num,
    //     mc1Color: req.body.mc1Color,
    //     wc2: req.body.wc2,
    //     mc2Num: req.body.mc2Num,
    //     mc2Color: req.body.mc2Color,
    //     wc3: req.body.wc3,
    //     mc3Num: req.body.mc3Num,
    //     mc3Color: req.body.mc3Color,
    //     wc4: req.body.wc4,
    //     mc4Num: req.body.mc4Num,
    //     mc4Color: req.body.mc4Color,
    //     wc5: req.body.wc5,
    //     mc5Num: req.body.mc5Num,
    //     mc5Color: req.body.mc5Color
    // })
    const user = new Userdb({
        name: req.body.name,
        address: req.body.name,
        status: req.body.status,
        water: req.body.water,
        area: req.body.area,
        cardNumber: req.body.cardNumber,
        cardEnabled: req.body.cardEnabled,
        agreement: req.body.agreement,
        registration: req.body.registration,
        boats: [
            {
                boat: req.body.wc1
            }
        ]
    })

    // save user in the database
    user
        .save(user)
        .then(data => {
            // res.send(data)
            res.redirect('/add-user');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res) => {

    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Erro retrieving user with id " + id })
            })

    } else {
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
    }


}

// Update a new idetified user by user id
exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "User was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

exports.export_db = async (req, res) => {
    const data = await Userdb.find().lean();
    // Convert arrays in documents to strings before writing to Excel file
    const stringData = data.map(doc => {
        const modifiedDoc = {};
        for (const key in doc) {
            if (key === '_id') {
                modifiedDoc._id = doc._id.toString();
            } else if (Array.isArray(doc[key])) {
                modifiedDoc[key] = doc[key].map(value => JSON.stringify(value)).join(', ');
            } else {
                modifiedDoc[key] = doc[key];
            }
        }
        return modifiedDoc;
    });

    const worksheet = XLSX.utils.json_to_sheet(stringData); // Convert data to a worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Add the worksheet to the workbook

    const filePath = './tmp/export.xlsx'; // Replace with your own file path
    XLSX.writeFile(workbook, filePath); // Write the workbook to an Excel file
    res.download(filePath);
    console.log(`Exported data to ${filePath}`);

}