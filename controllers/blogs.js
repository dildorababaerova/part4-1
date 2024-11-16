
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/hello', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
  blogsRouter.get('/info', async (request, response) => {
    const blogs = await Blog.find({})
        response.send(`<p>There are ${blogs.length} blogs in the database</p><p>${new Date()}</p>`)
  })

  
  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
  
    console.log('Resived POST REQUEST', request.body)

      const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

  try {
    const savedBlog = await blog.save()
        response.json(savedBlog)
   } catch(error) {
      next(error)
   } 
  });

  blogsRouter.delete('/:id', async (request, response, next) => {
      try {
      await Blog.findByIdAndDelete(request.params.id)
          response.status(204).end()
  } catch (error) {
  next(error)
  }
  });
  
  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(updatedBlog)
      console.log("Updated", updatedBlog)
    } catch(error) {
      next(error)
    }
  })

  module.exports = blogsRouter
  
  