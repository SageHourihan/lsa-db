var Userdb = require('../model/model');

// create and save new user
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    const user = new Userdb({
        name: req.body.name,
        address: req.body.address,
        dues: req.body.dues,
        status: req.body.status,
        water: req.body.water,
        area: req.body.area,
        cardNumber: req.body.cardNumber,
        cardEnabled: req.body.cardEnabled,
        agreement: req.body.agreement,
        registration: req.body.registration,
        wc1: req.body.wc1,
        mc1Num: req.body.mcNum1,
        mc1Color: req.body.mc1Color,
        wc2: req.body.wc2,
        mc2Num: req.body.mcNum2,
        mc2Color: req.body.mc2Color,
        wc3: req.body.wc3,
        mc3Num: req.body.mcNum3,
        mc3Color: req.body.mc3Color,
        wc4: req.body.wc4,
        mc4Num: req.body.mcNum4,
        mc4Color: req.body.mc4Color,
        wc5: req.body.wc5,
        mc5Num: req.body.mcNum5,
        mc5Color: req.body.mc5Color
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