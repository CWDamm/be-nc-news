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

    test('sorted by any column containing string data, in descending order, when given to sort_by query', () => {
        return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('title', { descending: true });
            })
    })

    test('sorted by any column containing numeric data, in descending order, when given to sort_by query', () => {
        return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('article_id', { descending: true });
            })
    })

    test('if sort_by not included, articles sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('created_at', { descending: true });
            })
    })

    test('when given order asc, but no sort_by, sorts by date created in ascending order', () => {
        return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('created_at', { descending: false });
            })
    })

    test('when given order asc, and a sort_by, sorts by that variable in ascending order', () => {
        return request(app)
            .get('/api/articles?order=asc&sort_by=votes')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy('votes', { descending: false });
            })
    })

    test('when given an invalid order, returns appropriate error msg', () => {
        return request(app)
            .get('/api/articles?order=ascending&sort_by=votes')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            })
    })

    test('when given an invalid sort_by, returns appropriate error msg', () => {
        return request(app)
            .get('/api/articles?order=asc&sort_by=not-a-variable')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            })
    })

    test('check there is no body property on the articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach(article => {
                    expect(article.body).toBeUndefined();
                })
            })
    })

    test('accepts a query to filter by topic', () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(12)
                body.articles.forEach(article => {
                    expect(article.topic).toBe("mitch");
                })
            })
    })

    test('an invalid query returns 404 error and appropriate message', () => {
        return request(app)
            .get('/api/articles?topic=mario')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("slug 'mario' not found")
            })
    })

    test('a valid query with no results returns an empty array and 200 status', () => {
        return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toEqual([]);
            })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('GETS an array of all articles with article id - status 200', () => {
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
                expect(response.body.msg).toBe("article_id '999999' not found");
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

    test('article has correct comment count', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article.comment_count).toBe(11)
            })
    })
})


describe('GETS /api/articles/:article_id/comments', () => {
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
                        article_id: 1
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
                expect(msg).toBe("article_id '999999' not found");
            })
    })

    test('responds with error message if article id is invalid', () => {
        return request(app)
            .get('/api/articles/not-an-article/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
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

describe('POSTS /api/articles/:article_id/comments', () => {
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
                expect(body.newComment).toMatchObject(returnedComment)
            })
    });

    test('responds with error message if article id is valid but does not exist', () => {

        const newComment = {
            username: 'icellusedkars',
            body: 'Unbelievable stuff Geoff!'
        }

        return request(app)
            .post('/api/articles/999999/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("article_id '999999' not found");
            })
    });

    test('sends an appropriate status and error message when given an invalid id', () => {

        const newComment = {
            username: 'icellusedkars',
            body: 'Uneblievable stuff Geoff!'
        }

        return request(app)
            .post('/api/articles/not-an-id/comments')
            .send(newComment)
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
                expect(msg).toBe("username 'spot_the_dog' not found");
            })
    });

    test('sends an appropriate status and error message when body field is missing', () => {

        const newComment = { username: 'icellusedkars' }

        return request(app)
            .post('/api/articles/9/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("missing field - body");
            });
    });

})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCHES an article with an updated votes property - status 200', () => {

        const voteUpdate = { inc_votes: 5 }

        const returnedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 105,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        return request(app)
            .patch('/api/articles/1')
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual(returnedArticle);
            })
    })

    test('provides correct adjustment if votes go down', () => {

        const voteUpdate = { inc_votes: -5 }

        const returnedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 95,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        return request(app)
            .patch('/api/articles/1')
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual(returnedArticle);
            })
    })

    test('responds with error message if article id is valid but does not exist', () => {

        const voteUpdate = { inc_votes: 5 }

        return request(app)
            .patch('/api/articles/999999')
            .send(voteUpdate)
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("article_id '999999' not found");
            })
    });

    test('sends an appropriate status and error message when given an invalid id', () => {

        const voteUpdate = { inc_votes: 5 }

        return request(app)
            .patch('/api/articles/not-an-id')
            .send(voteUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });

    test('sends an appropriate status and error message when given a malformed body (no increment)', () => {

        const voteUpdate = {}

        return request(app)
            .patch('/api/articles/1')
            .send(voteUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("no vote increment provided");
            });
    });

    test('sends an appropriate status and error message when given an invalid vote change', () => {

        const voteUpdate = { inc_votes: "not-an-increment" }

        return request(app)
            .patch('/api/articles/1')
            .send(voteUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });

})

describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE:200 deletes a comment with a given id", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(() => {
                return db.query("SELECT * FROM comments WHERE comment_id = 1")
                    .then(({ rowCount }) => {
                        expect(rowCount).toBe(0);
                    })
            })
    })

    test('DELETE:404 responds with an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .delete("/api/comments/999999")
            .expect(404)
            .then(response => {
                expect(response.body.msg).toBe("Comment not found")
            })
    })

    test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .delete("/api/comments/not-a-comment")
            .expect(400)
            .then(response => {
                expect(response.body.msg).toBe('Bad request');
            });
    });

})

describe("GET /api/users", () => {
    test("GET: 200 serves an array of objects containing all registered users", () => {

        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users.length).toBe(4);
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})

describe('GET /api/users/:username', () => {
    test('GET: 200 serves a user object matching the given username', () => {
        return request(app)
            .get('/api/users/icellusedkars')
            .expect(200)
            .then(({ body }) => {
                console.log(body);
                expect(body.user).toMatchObject({
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                })
            })
    })

    test('ERROR: 404 sends an appropriate status and error message when given a valid but non-existent username', () => {
        return request(app)
            .get('/api/users/spot_the_dog')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("username 'spot_the_dog' not found");
            });
    });
})


