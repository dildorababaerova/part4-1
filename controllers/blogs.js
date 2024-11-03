
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/hello', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
  
    console.log('Resived POST REQUEST', request.body)
  
    blog
      .save()
      .then(savedBlog => {
        response.json(savedBlog)
      }).catch(error => next(error))
  })

  module.exports = blogsRouter
  
  