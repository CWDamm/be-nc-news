const db = require("../db/connection");
const fs = require("fs/promises");

function selectEndpoints() {

    return fs.readFile("./endpoints.json", "utf8")
    .then((endpoints) => {
        return JSON.parse(endpoints);
    })
}

module.exports = selectEndpoints;