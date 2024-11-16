const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blogs");

const initialBlogs = [
  {
    title: "Test title",
    author: "Didi",
    url: "http//:raseko.com",
    likes: 100000000000
  },
  { title: "Test2 title",
    author: "Didi",
    url: "http//:raseko.com/information",
    likes: 200000000000 },
]

beforeEach(async () => {
  // Очистка базы данных перед каждым тестом
  await Blog.deleteMany({})

  // Добавление начальных заметок
  let blogsObject = new Blog(initialBlogs[0])
  await blogsObject.save()
  blogsObject = new Blog(initialBlogs[1])
  await blogsObject.save()
})

// Тест: проверка количества заметок
test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  // Проверка, что количество заметок соответствует количеству начальных данных
  assert.strictEqual(response.body.length, initialBlogs.length, 4)
})

// Тест: проверка содержания первой заметки
test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  // Проверка, что одна из заметок содержит строку 'HTML is easy'
  const titles = response.body.map(e => e.title)
  assert(titles.includes('Test title'))
})

after(async () => {
  // Закрытие соединения с базой данных после выполнения тестов
  await mongoose.connection.close()
})






// const { test, after } = require('node:test')
// const assert = require('assert')
// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const { config } = require('dotenv')

// const api = supertest(app)

// console.log('test started', config.MONGODB_URI);

// test('blogs are returned as json', async () => {
//   await api
//     .get('/api/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })


// test('there are 4 blogs', async () => {
//   const response = await api.get('/api/blogs')
//   console.log(response.body);
  
//   assert.strictEqual(response.body.length, 4)
// })

// test('the first blog\'s title is "Blalalal"', async () => {
//   const response = await api.get('/api/blogs')
  
//   const titles = response.body.map(e => e.title)
//   assert.strictEqual(titles.includes('Blalalal'), true)
// })
// after(async () => {
//   await mongoose.connection.close()
// })