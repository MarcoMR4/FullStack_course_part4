const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(notes)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if(blog){
    response.json(blog)
  }
  else{
    response.status(404).end()
  }
})


// ********************4.17 step 5: impement authorization required for creating new blogs and add user id to the blog 
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  console.log("Authorization Header:", request.headers.authorization);

  const decodedToken = jwt.verify(tokenExtractor(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title, 
    author: body.author, 
    url: body.url, 
    likes: body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  console.log('Received ID:', request.params.id); 

  const blog = {
    title: body.title, 
    author: body.author, 
    url: body.url, 
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new : true})
  response.json(updatedBlog)
})

module.exports = blogsRouter