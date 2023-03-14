const mongoose = require('mongoose');

// !old schema
// var schema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     dues: String,
//     status: String,
//     water: String,
//     area: Number,
//     cardNumber: Number,
//     cardEnabled: String,
//     agreement: String,
//     registration: String,
//     wc1: String,
//     mc1Num: String,
//     mc1Color: String,
//     wc2: String,
//     mc2Num: String,
//     mc2Color: String,
//     wc3: String,
//     mc3Num: String,
//     mc3Color: String,
//     wc4: String,
//     mc4Num: String,
//     mc4Color: String,
//     wc5: String,
//     mc5Num: String,
//     mc5Color: String,
//     __v: { type: Number, select: false }
// })

var schema = new mongoose.Schema({
    name: String,
    address: String,
    boats: [{
        mc: String,
        make: String,
        color: String
    }],
    dues: String,
    status: String,
    water: String,
    area: Number,
    cardNumber: Number,
    cardEnabled: String,
    agreement: String,
    registration: String
})

const Userdb = mongoose.model('userdb', schema, 'test');

module.exports = Userdb;