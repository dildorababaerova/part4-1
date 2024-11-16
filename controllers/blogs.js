
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/hello', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  blogsRouter.get('/', async (request, response, next) => {
    try {
      const blogs = await Blog.find({})
      response.json(blogs)
    } catch(error) {
      next(error)
    }
  })  

  blogsRouter.get('/info', async (request, response, next) => {
    try {
    const blogs = await Blog.find({})
        response.send(`<p>There are ${blogs.length} blogs in the database</p><p>${new Date()}</p>`)
    } catch(error) {
      next(error)
    }
  })

  blogsRouter.get('/:id', async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id);
      if (blog) {
        response.status(200).json(blog);
      } else {
        response.status(404).end();
      }
    } catch (exeption) {
      next(exeption);
    }
  });

  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
  
    console.log('Resived POST REQUEST', request.body)

    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })
    
    if (!body.title || !body.author || !body.url) {
      return response.status(400).json({ error: 'title, author, and url are required' });
    }

  try {
    const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
   } catch(exeption) {
      next(exeption)
   } 
  });

  blogsRouter.delete('/:id', async (request, response, next) => {
      try {
      await Blog.findByIdAndDelete(request.params.id)
          response.status(204).end()
  } catch (exeption) {
  next(exeption)
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
    } catch(exeption) {
      next(exeption)
    }
  })

  module.exports = blogsRouter
  
  