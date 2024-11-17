const Blog = require('../models/blogs')

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

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: "willremovethissoon",
    author: "Didi",
    url: "http//:raseko.com/remove",
    likes: 10 
})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs= await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}