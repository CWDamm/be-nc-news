const db = require("../db/connection");

function selectUsers() {
    return db
        .query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        })
}

function selectUserById(username) {

    return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            return rows[0];
        })
}

module.exports = { selectUsers, selectUserById }

