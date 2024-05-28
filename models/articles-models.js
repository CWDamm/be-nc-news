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

function selectArticles() {
    return db
    .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COALESCE(comment_count_table.comment_count, 0) AS INT) AS comment_count
        FROM articles
        LEFT JOIN 
            (SELECT article_id, COUNT(article_id) AS comment_count 
            FROM comments
            GROUP BY article_id) AS comment_count_table
        ON articles.article_id = comment_count_table.article_id
        ORDER BY created_at DESC`
    )
    .then(({rows}) => {
        return rows;
    })
}

module.exports = {selectArticles, selectArticleById};