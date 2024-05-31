const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(id) {

    let sqlQuery = `SELECT articles.*, 
        CAST(COALESCE(comment_count_table.comment_count, 0) AS INT) AS comment_count
        FROM articles
        LEFT JOIN 
        (SELECT article_id, COUNT(article_id) AS comment_count 
        FROM comments
        GROUP BY article_id) AS comment_count_table
        ON articles.article_id = comment_count_table.article_id
        WHERE articles.article_id = $1`

    return db
        .query(sqlQuery, [id])
        .then(({ rows }) => {
            return rows[0];
        })
}

function selectArticles(topic, sort_by, order) {

    const validSortVariables = [
        'author',
        'title',
        'article_id',
        'topic',
        "created_at",
        "votes",
        "article_img_url"
    ];
    const validOrderVariables = ["asc", "desc"];

    if (sort_by && !validSortVariables.includes(sort_by)) {
        return Promise.reject({ 'status': 400, msg: 'Bad Request' });
    }

    if (order && !validOrderVariables.includes(order)) {
        return Promise.reject({ 'status': 400, msg: 'Bad Request' });
    }

    let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COALESCE(comment_count_table.comment_count, 0) AS INT) AS comment_count
        FROM articles
        LEFT JOIN 
            (SELECT article_id, COUNT(article_id) AS comment_count 
            FROM comments
            GROUP BY article_id) AS comment_count_table
        ON articles.article_id = comment_count_table.article_id`

    let inputValues = []

    if (topic) {
        sqlQuery += ` WHERE topic = $1`
        inputValues.push(topic);
    }

    if (sort_by) {
        sqlQuery += ` ORDER BY ${sort_by}`
    } else {
        sqlQuery += ` ORDER BY created_at`
    }

    if (order) {
        sqlQuery += ` ${order}`
    } else {
        sqlQuery += ` DESC`
    }

    return db
        .query(sqlQuery, inputValues)
        .then(({ rows }) => {
            return rows;
        })
}

function selectCommentsByArticleId(article_id) {
    return db
        .query(`SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

function insertCommentByArticleId(newComment, article_id) {
    const { body } = newComment;
    const author = newComment.username;
    const inputValues = [author, body, article_id];

    const formattedSqlQuery = format(
        `INSERT INTO comments 
        (author, body, article_id)
        VALUES (%L) RETURNING *;`
        , inputValues);

    return db
        .query(formattedSqlQuery)
        .then((result) => {
            return result.rows[0];
        })
}

function updateArticleById(article_id, voteChange) {

    const sqlQuery = `
    UPDATE articles 
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`

    return db
        .query(sqlQuery, [article_id, voteChange])
        .then(({ rows: [updatedArticle] }) => {
            return updatedArticle;
        })
}

function insertArticle(newArticle) {
    const { author, title, body, topic, article_img_url } = newArticle;
    const inputValues = [author, title, body, topic]
    let colnames = "author, title, body, topic";

    if(article_img_url) {
        inputValues.push(article_img_url);
        colnames += ", article_img_url"
    }

    const formattedSqlQuery = format(
        `INSERT INTO articles 
        (${colnames})
        VALUES (%L) RETURNING *;`
        , inputValues);

    return db
        .query(formattedSqlQuery)
        .then(({ rows: [article] }) => {
            return selectArticleById(article["article_id"]);
        })
}

module.exports = {
    selectArticles,
    insertArticle,
    selectArticleById,
    updateArticleById,
    selectCommentsByArticleId,
    insertCommentByArticleId
};