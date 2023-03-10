const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
<<<<<<< HEAD
    axios.get('https://test-lsa-db.fly.dev/api/users')
=======
    axios.get('http://localhost:8080/api/users')
>>>>>>> dev
        .then(function (response) {
            res.render('index', { users: response.data });
        })
        .catch(err => {
            res.send(err);
        })


}

exports.add_user = (req, res) => {
    res.render('add_user');
}

exports.update_user = (req, res) => {
<<<<<<< HEAD
    axios.get('https://test-lsa-db.fly.dev/api/users', { params: { id: req.query.id } })
=======
    axios.get('http://localhost:8080/api/users', { params: { id: req.query.id } })
>>>>>>> dev
        .then(function (userdata) {
            res.render("update_user", { user: userdata.data })
        })
        .catch(err => {
            res.send(err);
        })
}
