const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { title: 'Great Book',
    author: 'francis dancis',
    url: 'greatbook.com',
    likes: 10
  },
  { title: 'Excellent book',
    author: 'jamie capstone',
    url: 'excellentbook.com',
    likes: 9
  },
  { title: 'Even Better Book',
    author: 'francis dancis',
    url: 'evenbetterbook.com',
    likes: 11
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}