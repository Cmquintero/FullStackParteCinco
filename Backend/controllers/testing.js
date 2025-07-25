const testingRouter = require('express').Router()
const blog = require('../models/blogs')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter