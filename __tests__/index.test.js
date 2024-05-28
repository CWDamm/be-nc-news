const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const { topicData, userData, articleData, commentData } = require('../db/data/test-data/index');

beforeEach(() => seed({ topicData, userData, articleData, commentData }))
afterAll(() => db.end())

describe('GET /api/topics', () => {
    test('returns appropriate error message when given a bad route - status 404', () => {
        return request(app)
            .get('/api/bananas')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Route not found")
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
