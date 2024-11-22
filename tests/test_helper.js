const Blog = require('../models/blogs')
const User = require('../models/user')


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
    
    { title: "Test3 title",
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

// const nonExistingLikes = async () => {
//   const blog = new Blog({ 
//     title: "willremovethissoon",
//     author: "Didi",
//     url: "http//:raseko.com/remove"
// })
//   await blog.save()
//   return blog
// }


const blogsInDb = async () => {
  const blogs= await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb,
  usersInDb
}