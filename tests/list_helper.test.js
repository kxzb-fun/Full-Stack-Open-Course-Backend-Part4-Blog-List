const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogList = require("../mock/blogs");
test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  const listWithZeroBlog = [];

  test("when list has only 0 blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithZeroBlog);
    assert.strictEqual(result, 0);
  });
});

describe("favorite blog", () => {
  const listWithZeroBlog = [];

  test("when list has only 0 blog, equals the likes of that", () => {
    const result = listHelper.favoriteBlog(listWithZeroBlog);
    assert.strictEqual(result, null);
  });

  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 15,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 15,
    });
  });

  test("when list has many blog, equals the likes of that", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogList), {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most Blogs", () => {
  test("mostBlogs", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogList), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("mostLikes", () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogList), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
