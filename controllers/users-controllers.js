const { selectUsers, selectUserById } = require("../models/users-models")
const { checkExists } = require('../utils/check-exists');

function getUsers(req, res, next) {
    selectUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err);
        })
}

function getUserById(req, res, next) {
    const {username} = req.params;

    const promises = [
        selectUserById(username),
        checkExists("users", "username", username)
    ]
    
    Promise.all(promises)  
        .then(([user]) => {
            res.status(200).send({ user })
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = { getUsers, getUserById }