const blog = require('../models/blog')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumLikes = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}

  let mostLikes = -1
  let favBlog

  blogs.forEach( (blog) => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      favBlog = blog
    }
  })

  return {
    'title' : favBlog.title,
    'author': favBlog.author,
    'likes': favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0 ) return {}

  const authors = _.countBy(blogs, (blog) => {
    return blog.author
  })

  let max = -1
  let favAuthor = null

  for (const author in authors) {
    if (authors[author] > max) {
      max = authors[author]
      favAuthor = author
    }
  }

  return {
    'author': favAuthor,
    'blogs': max
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authors =
    _(blogs)
      .groupBy('author')
      .map((objs, key) => ({
        'author': key,
        'likes': _.sumBy(objs, 'likes') }))
      .value()

  let max = -1
  let favAuthor = null

  authors.forEach( obj => {
    if (obj.likes > max) {
      max = obj.likes
      favAuthor = obj.author
    }
  })

  return {
    'author': favAuthor,
    'likes': max
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}