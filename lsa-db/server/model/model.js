const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    dues: String,
    status: String,
    water: String,
    area: Number,
    cardNumber: Number
})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;