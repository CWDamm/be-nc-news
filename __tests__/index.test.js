const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const { topicData, userData, articleData, commentData } = require('../db/data/test-data/index');
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }))
afterAll(() => db.end())

describe('invalid route', () => {
    test('returns appropriate error message when given a bad route - status 404', () => {
        return request(app)
            .get('/api/bananas')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Route not found")
            })
    })
})

describe('/api', () => {
    test('GETS a description of all other available endpoints as JSON - status 200', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                const endpointsCount = Object.keys(endpoints).length;
                expect(body.endpoints).toEqual(endpoints);
            })
    })
})

describe('GET /api/topics', () => {
    test('GETS an array of all topics - status 200', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).toBe(3)
                body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
            })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('GETS an array of all topics - status 200', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
            })
    })

    test('sends an appropriate status and error message when given a valid but non-existent id - status 404', () => {
        return request(app)
            .get('/api/articles/999999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('no article found with matching id');
            });
    });

    test('sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-an-article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });
})

describe('GET /api/articles', () => {
    test('GETS an array of all articles - status 200', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })

    test('articles have correct comment count', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.find(article => article.article_id === 1).comment_count).toBe(11)
                expect(body.articles.find(article => article.article_id === 2).comment_count).toBe(0)
            })
    })

    test('articles sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('created_at', { descending: true });
            })
    })

    test('no body property on the articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach(article => {
                    expect(article.body).toBeUndefined();
                })
            })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GETS an array of all comments associated with an article id - status 200', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(11)
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                })
            })
    })

    test('comments sorted by descending order of creation date', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(11)
                expect(body.comments).toBeSortedBy('created_at', { descending: true });
            })
    })

    test('responds with error message if article id does not exist', () => {
        return request(app)
            .get('/api/articles/999999/comments')
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("no article found with matching id");
            })
    })

    test('responds with empty array if article id has no comments', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toEqual([]);
            })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('POSTS a new comment to an article with article id - status 201', () => {

        const newComment = {
            username: 'icellusedkars',
            body: 'Uneblievable stuff Geoff!'
        }

        const returnedComment = {
            author: 'icellusedkars',
            body: 'Uneblievable stuff Geoff!',
            article_id: 9,
            votes: 0
        }

        return request(app)
            .post('/api/articles/9/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                console.log(body.newComment);
                expect(body.newComment).toMatchObject(returnedComment)
            })
    });

    test('responds with error message if article id is valid but does not exist', () => {

         return request(app)
            .get('/api/articles/999999/comments')
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("no article found with matching id");
            })
    });

    test('sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-an-article/comments')
        .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });

    test('returns error message when username does not exist - status 404', () => {

        const newComment = {
            username: 'spot_the_dog',
            body: 'Uneblievable stuff Geoff!'
        }

        return request(app)
            .post('/api/articles/9/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("username not found");
            })
    });

 })



