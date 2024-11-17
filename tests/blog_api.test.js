const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blogs");



beforeEach(async () => {
  // Очистка базы данных перед каждым тестом
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// Тест: проверка количества заметок
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  // Проверка, что количество заметок соответствует количеству начальных данных
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// Тест: проверка содержания первой заметки
test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  // Проверка, что одна из заметок содержит строку 'HTML is easy'
  const titles = response.body.map(e => e.title)
  assert(titles.includes('Test title'))
})

test('a valid blog can be added ', async () => {
  const newBlog = 
  {
    title: "New blog",
    author: "Didi",
    url: "http://raseko.com/new",
    likes: 11
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)

  assert(titles.includes('New blog'))
})

test('blog without content is not added', async () => {
  const newBlog = {
    title: "New blog"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]


  const resultBlog = await api
  .get(`/api/blogs/${blogToView.id}`)  // Здесь используем blogToView.id
  .expect(200)
  .expect('Content-Type', /application\/json/);


    assert.deepStrictEqual(resultBlog.body.title, blogToView.title);
    assert.deepStrictEqual(resultBlog.body.author, blogToView.author);
    assert.deepStrictEqual(resultBlog.body.url, blogToView.url);
    assert.deepStrictEqual(resultBlog.body.likes, blogToView.likes);
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]


  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
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