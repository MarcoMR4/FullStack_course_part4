const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const helper2 = require('./test_helper')


describe('Basic operations with blogs', () => {
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
    test('A valid blog can be added ', async () => {

        const token = await helper2.getValidToken()

        const newBlog = {
            title: 'A new blog for our test',
            author: 'example',
            url: "http://www.exampleBlog.com", 
            likes: 1,
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
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

        const token = await helper2.getValidToken()

        const newBlog = {
            title: 'A new blog for our test without likes',
            author : "Mark MR", 
            url: "http://www.exampleBlog.com", 
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
    })
    
    // 4.12 
    test('A blog without a title cannot de added', async () => {

        const token = await helper2.getValidToken()

        const newBlog ={
            author: "Juan Perez", 
            url: "www.example.com"
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('A blog cannot be added without authorization. ', async () => {

        const newBlog ={
            author: "Juan Perez", 
            url: "www.example.com"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    
    describe('delete and update blogs', () => {
        // 4.13 

        const token = helper2.getValidToken()

        test('A blog with an specific id can be deleted', async () => {
            const originalBlogs = await helper.blogsInDb()
            const blogToDelete = originalBlogs[originalBlogs.length - 1].id
    
            await api 
                .delete(`/api/blogs/${blogToDelete}`)
                .expect(204)
            
            const blogsAtTheEnd = await helper.blogsInDb()
    
            assert.strictEqual(blogsAtTheEnd.length, originalBlogs.length - 1)
        })
    
        // 4.14
        test('The number of likes of a blog can be updated', async () => {
            const originalBlogs = await helper.blogsInDb()
            const blogToUpdate = originalBlogs[0]
            const updatedBlog = {
                likes: 10
            }
    
            await api 
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
            
            const blogsAtTheEnd = await helper.blogsInDb()
    
            assert.strictEqual(blogsAtTheEnd[0].likes, updatedBlog.likes)
        })
    
    })    

})


after(async () => {
    await mongoose.connection.close()
})