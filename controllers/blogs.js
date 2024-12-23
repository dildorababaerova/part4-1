const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
// const middleware = require('../utils/middleware')
const User = require('../models/user')

blogsRouter.get('/hello', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

blogsRouter.get('/', async (request, response) => {
  
  const blogs = await Blog
  .find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
  
})  

blogsRouter.get('/info', async (request, response) => {
  
  const blogs = await Blog.find({})
  response.send(`<p>There are ${blogs.length} blogs in the database</p><p>${new Date()}</p>`)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.status(200).json(blog);
  } else {
    response.status(404).end();
  }
});

const getTokenFrom = request => {  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) 
    {
        return authorization.replace('Bearer ', '')  
    }  
      return null}

    
    blogsRouter.post('/',  async (request, response) => {
      const body = request.body;
      // const user = request.user;

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  
    if (!decodedToken.id) {
          return response.status(401).json({ error: 'token invalid' })  
        }  
    const user = await User.findById(decodedToken.id)
  
    console.log("User", user)

    if (!user) {
      return response.status(401).json({ error: 'token invalid, User does not' })  
    }
    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    

    if (!body.title || !body.author || !body.url) {
      return response.status(400).json({ error: 'title, author, and url are required' });
    }
    
    console.log('Saving blog:', blog);

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  });

  blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    } 
      
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' });
    }

    await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
  });
  
  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.status(200).json(updatedBlog)
      console.log("Updated", updatedBlog)
  })

  module.exports = blogsRouter
  
  