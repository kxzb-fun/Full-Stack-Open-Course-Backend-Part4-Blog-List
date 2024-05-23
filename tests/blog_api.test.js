const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");

const { initBlogs, nonExistingId, blogsInDb } = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("cleared all blogs");
  const blogList = initBlogs.map((blog) => new Blog(blog));
  const blogListPromise = blogList.map((blog) => blog.save());
  await Promise.all(blogListPromise);
  console.log("done");
});

const api = supertest(app);
// 4.8
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// 4.9 NB TODO
test('Blog post identifier property should be named "id', async () => {
  const validNonexistingId = await nonExistingId();
  s;
  const res = await api.get(`/api/blogs/${validNonexistingId}`).expect(200);
  assert.strictEqual(res.body, null);
});

// 4.10  测试路由API blog 可以添加
test("a valid blog can be added", async () => {
  //  add a new blog
  const newBlog = {
    title: "new blog 233",
    author: "zhangsan",
    url: "https://reactpatterns.com/",
    likes: 0,
  };
  //   注意这里添加数据要使用 send方法
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await blogsInDb();
  assert.strictEqual(response.length, initBlogs.length + 1);
  const authors = response.map((i) => i.author);
  assert(authors.includes("zhangsan"));
});

// 4.11
test("blog without likes is not added", async () => {
  const newBlog = {
    title: "new blog 233",
    author: "zhangsan",
    url: "https://112.com/",
  };
  await api.post("/api/blogs").send(newBlog).expect(201);
  const response = await blogsInDb();
  assert.strictEqual(response.length, initBlogs.length + 1);
});
// 4.12
test("blog without title or url is not added", async () => {
  const noUrl = {
    title: "new blog 233",
    author: "zhangsan",
    likes: 0,
  };
  await api.post("/api/blogs").send(noUrl).expect(400);
  const response = await blogsInDb();
  assert.strictEqual(response.length, initBlogs.length);
  const noTitle = {
    author: "zhangsan",
    url: "https://1112.com/",
    likes: 0,
  };
  await api.post("/api/blogs").send(noTitle).expect(400);
  const res = await blogsInDb();
  assert.strictEqual(res.length, initBlogs.length);
});

// 4.13 删除单个blog的测试
test("delete blog by id", async () => {
  const blogs = await blogsInDb();
  const blogToDelete = blogs[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const afterBlogs = await blogsInDb();
  const urlList = afterBlogs.map((r) => r.url);
  assert(!urlList.includes(blogToDelete.url));

  assert.strictEqual(afterBlogs.length, initBlogs.length - 1);
});
// 4.14 跟新测试 update test

test("Update blog post data", async () => {
  const blogs = await blogsInDb();
  const blogToUpdate = blogs[0];
  // 模拟更新博客文章的数据
  const updatedData = {
    title: "Updated Post Title",
    author: "Updated Author",
    url: "updated-url",
    likes: 10,
  };

  // 执行更新操作
  const res = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData);
  const updatedPost = res.body;
  // 验证更新后的数据是否符合预期
  assert.strictEqual(updatedPost.title, updatedData.title);
  assert.strictEqual(updatedPost.author, updatedData.author);
  assert.strictEqual(updatedPost.url, updatedData.url);
  assert.strictEqual(updatedPost.likes, updatedData.likes);
});

// 一旦所有测试（目前只有一个）完成运行，我们必须关闭 Mongoose 使用的数据库连接。这可以通过 after 方法轻松实现：
after(async () => {
  await mongoose.connection.close();
});
