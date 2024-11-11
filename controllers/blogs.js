
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
  blogsRouter.get('/info', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.send(`<p>There are ${blogs.length} blogs in the database</p><p>${new Date()}</p>`)
      })
  })

  
  blogsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    console.log('Resived POST REQUEST', request.body)

      const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

  
    blog
      .save()
      .then(savedBlog => {
        response.json(savedBlog)
      }).catch(error => next(error))
  })

  blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => next(error))
  })

  module.exports = blogsRouter
  
  