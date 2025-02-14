const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const Blog = require('../models/blog')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter