const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('test', 10)
  const user = new User({ username: 'test', passwordHash })
  await user.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const users = await helper.usersInDb()
  console.log(users)
  const blogObjects = helper.initialBlogs.map(blog => {
    blog.user = users[0].id
    return new Blog(blog)
  })

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('Make GET Request', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Make POST Request', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Gurse16',
    url: 'testBlog.com',
    likes: 16
  }

  const user = {
    username: 'test',
    password: 'test'
  }

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${result.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  const contents = updatedBlogs.map(b => b.title)
  expect(contents).toContain(
    'testBlog'
  )
})

test('Make DELETE Request', async () => {
  let blogs = await helper.blogsInDb()
  const idtoDelete = blogs[0].id

  const user = {
    username: 'test',
    password: 'test'
  }

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  await api
    .delete(`/api/blogs/${idtoDelete}`)
    .set('Authorization', `bearer ${result.body.token}`)
    .expect(204)

  blogs = await helper.blogsInDb()

  expect(blogs).toHaveLength(helper.initialBlogs.length - 1)
})

test('Make PUT Request', async () => {
  let blogs = await helper.blogsInDb()
  const blogToUpdate = blogs[0]


  const newBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    user: blogToUpdate.user,
    likes: blogToUpdate.likes + 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
  expect(updatedBlogs[0].likes).toEqual(blogToUpdate.likes + 10)
})

test('Unique identifier is name id', async () => {
  const blogs = await helper.blogsInDb()

  for (let blog of blogs) {
    expect(blog.id).toBeDefined()
  }
})

test('Default likes is 0', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Gurse16',
    url: 'testBlog.com'
  }

  const user = {
    username: 'test',
    password: 'test'
  }

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${result.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  const likes = updatedBlogs.map(b => b.likes)
  expect(likes[helper.initialBlogs.length]).toEqual(0)
})

test('Missing Title POST', async () => {
  const newBlog = {
    author: 'Gurse16',
    url: 'testBlog.com',
    likes: 16
  }

  const user = {
    username: 'test',
    password: 'test'
  }

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${result.body.token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Missing URL POST', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Gurse16',
    likes: 16
  }

  const user = {
    username: 'test',
    password: 'test'
  }

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${result.body.token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Missing token', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Gurse16',
    likes: 16
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('invalid token')
})

afterAll(() => {
  mongoose.connection.close()
})