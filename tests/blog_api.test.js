const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)  
})

// 4.8
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// 4.9
test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.deepStrictEqual(resultBlog.body, blogToView)
})

// 4.10
test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'A new blog for our test',
        author : "Mark MR", 
        url: "http://www.exampleBlog.com", 
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('A new blog for our test'))
})

// 4.11 
test('A blog without likes will default to 0', async () => {
    const newBlog = {
        title: 'A new blog for our test without likes',
        author : "Mark MR", 
        url: "http://www.exampleBlog.com", 
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
})

// 4.12 
test('A blog without a title cannot de added', async () => {
    const newBlog ={
        author: "Juan Perez", 
        url: "www.example.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})




after(async () => {
    await mongoose.connection.close()
})