const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 3600 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter