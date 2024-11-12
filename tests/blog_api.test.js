const { test, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test('there are 4 blogs', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body);

  assert.strictEqual(response.body.length, 4)
})

test('the first blog\'s title is "Blalalal"', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles.includes('Blalalal'), true)
})