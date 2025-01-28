const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title" : "First blog",
        "author" : "Mark MR", 
        "url": "http://www.exampleBlog.com", 
        "likes": 2
    },
    {
        "title" : "Second blog",
        "author" : "Mark MR", 
        "url": "http://www.exampleBlog.com", 
        "likes": 2
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}