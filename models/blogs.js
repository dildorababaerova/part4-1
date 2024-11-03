const mongoose = require('mongoose')


const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


  module.exports = mongoose.model('Blog', blogSchema)