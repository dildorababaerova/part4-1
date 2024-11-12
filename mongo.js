require('dotenv').config()
const mongoose = require('mongoose')

const url =process.env.TEST_MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const testBlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const TestBlog = mongoose.model('TestBlog', testBlogSchema)

const testBlog = new TestBlog({
  title: "Test title",
  author: "Didi",
  url: "http//:raseko.com",
  likes: 100000000000
})




testBlog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
})