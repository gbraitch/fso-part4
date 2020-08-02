const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is 0', () => {
    const blogs = []
    expect(listHelper.totalLikes(blogs)).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [{
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 10
    }]
    expect(listHelper.totalLikes(blogs)).toBe(10)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'test',
        author: 'test',
        url: 'test',
        likes: 10
      },
      { title: 'test',
        author: 'test',
        url: 'test',
        likes: 20
      },
      { title: 'test',
        author: 'test',
        url: 'test',
        likes: 3
      }
    ]
    expect(listHelper.totalLikes(blogs)).toBe(33)
  })
})

describe('favourite blog', () => {
  test('of empty list is {}', () => {
    expect(listHelper.favoriteBlog([])).toEqual({})
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [{
      title: 'test1',
      author: 'test3',
      url: 'test2',
      likes: 10
    }]

    expect(listHelper.favoriteBlog(blogs))
      .toEqual( {
        title: 'test1',
        author: 'test3',
        likes: 10
      })
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 't1',
        author: 't2',
        url: 't3',
        likes: 10
      },
      { title: 't4',
        author: 't5',
        url: 't6',
        likes: 9
      },
      { title: 't7',
        author: 't8',
        url: 't9',
        likes: 11
      }
    ]

    expect(listHelper.favoriteBlog(blogs))
      .toEqual({
        title: 't7',
        author: 't8',
        likes: 11
      })
  })

})

describe('most blogs', () => {
  test('of empty list is {}', () => {
    expect(listHelper.mostBlogs([])).toEqual({})
  })

  test('when list has only one blog equals that author with 1 blog', () => {
    const blogs = [{
      title: 'test1',
      author: 'test3',
      url: 'test2',
      likes: 10
    }]

    expect(listHelper.mostBlogs(blogs))
      .toEqual( {
        author: 'test3',
        blogs: 1
      })
  })

  test('bigger list is calculated right', () => {
    const blogs = [
      { title: 't1',
        author: 'francis',
        url: 't3',
        likes: 10
      },
      { title: 't4',
        author: 'jamie',
        url: 't6',
        likes: 9
      },
      { title: 't7',
        author: 'francis',
        url: 't9',
        likes: 11
      }
    ]

    expect(listHelper.mostBlogs(blogs)).toEqual({
      'author': 'francis',
      'blogs': 2
    })
  })
})

describe('most likes', () => {
  test('of empty list is {}', () => {
    expect(listHelper.mostLikes([])).toEqual({})
  })

  test('when list has only one blog equals that author with amount of likes', () => {
    const blogs = [{
      title: 'test1',
      author: 'test3',
      url: 'test2',
      likes: 10
    }]

    expect(listHelper.mostLikes(blogs))
      .toEqual( {
        author: 'test3',
        likes: 10
      })
  })

  test('bigger list is calculated right', () => {
    const blogs = [
      { title: 't1',
        author: 'francis',
        url: 't3',
        likes: 10
      },
      { title: 't4',
        author: 'jamie',
        url: 't6',
        likes: 9
      },
      { title: 't7',
        author: 'francis',
        url: 't9',
        likes: 11
      }
    ]

    expect(listHelper.mostLikes(blogs)).toEqual({
      'author': 'francis',
      'likes': 21
    })
  })
})