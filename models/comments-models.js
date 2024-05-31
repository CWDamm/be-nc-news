const db = require("../db/connection");

function removeCommentById(comment_id) {

    return db
    .query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
        .then(({ rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found" })
            }
        })
}

function updateCommentById(comment_id, inc_votes) {

    if (!inc_votes && inc_votes !== 0) {
        return Promise.reject({ status: 400, msg: "no vote increment provided" })
    }

    const sqlQuery = `
        UPDATE comments 
        SET votes = votes + $2
        WHERE comment_id = $1
        RETURNING *;`

    return db
    .query(sqlQuery, [comment_id, inc_votes])
    .then(({ rows }) => {
        return rows[0];
    })
}

module.exports = { removeCommentById, updateCommentById }