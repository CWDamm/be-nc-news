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
    test('returns a description of all other available endpoints as JSON - status 200', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                const endpointsCount = Object.keys(endpoints).length;
                expect(Object.keys(body.endpoints).length).toBe(endpointsCount)
                expect(body.endpoints).toEqual(endpoints);
            })
    })
})

describe('GET /api/topics', () => {
    test('sends an array of all topics to the client - status 200', () => {
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
    test('sends an array of all topics to the client - status 200', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
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