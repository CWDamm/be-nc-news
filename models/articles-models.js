const db = require("../db/connection");

function selectArticleById(id) {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        if(!rows[0]) {
            return Promise.reject( {status: 404, msg: "no article found with matching id" })
        }
        return rows[0];
    })
}

module.exports = selectArticleById;