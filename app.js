const express = require('express')
const app = express()
const {getEndpoints} = require('./controllers/endpoints-controllers.js')
const {getTopics} = require('./controllers/topics-controllers.js')
const {getArticles, getArticleById, getCommentsByArticleId} = require('./controllers/articles-controllers.js')

app.get(`/api`, getEndpoints)

app.get(`/api/topics`, getTopics)

app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.all('*', (req, res) => {
    res.status(404).send({ msg: "Route not found" });
})

app.use((err, req, res, next) => {
    // console.log(err);
    if(["22P02"].includes(err.code) ) {
    res.status(400).send({ msg: "Bad request" });
    } else {
      next(err)
    }
  })

app.use((err, req, res, next) => {
    if (err.msg) {
      res.status(err.status).send( { msg: err.msg });
    } else {
      next (err);
    }
  })

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' })
})

module.exports = app; 