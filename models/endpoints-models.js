const db = require("../db/connection");
const fs = require("fs/promises");

function selectEndpoints() {

    return fs.readFile("./endpoints.json", "utf8")
    .then((endpoints) => {
        return JSON.parse(endpoints);
    })
    .catch((err) => {next(err)})
}

module.exports = selectEndpoints;