const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
// 需要单独引入
const assert = require("node:assert");
const Blog = require("../models/blog");

const { initBlogs, nonExistingId, blogsInDb } = require("./test_helper");

// 一开始就清空了数据库，之后我们将initialNotes数组中存储的两条笔记保存到数据库中。
// 通过这样做，我们确保数据库在每次测试运行之前都处于相同的状态。
beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("cleared all blogs");
  const blogList = initBlogs.map(blog=>new Blog(blog))
  const blogListPromise = blogList.map(blog=>blog.save())
  await Promise.all(blogListPromise)
  console.log("done");
});

// 该测试从 app.js 模块导入 Express 应用程序，并将其与 supertest 函数一起包装到所谓的 superagent 对象中。该对象被分配给 api 变量，测试可以使用它向后端发出 HTTP 请求。
const api = supertest(app);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  // 所需值现在定义为正则表达式或短正则表达式 原则上，测试也可以定义为字符串 .expect('Content-Type', 'application/json')
  // 然而，这里的问题是，当使用字符串时，标头的值必须完全相同。对于我们定义的正则表达式，标头包含有问题的字符串是可以接受的。 header的实际值是application/json； charset=utf-8，即还包含有关字符编码的信息。但是，我们的测试对此不感兴趣，因此最好将测试定义为正则表达式而不是精确的字符串。
});

// 一旦所有测试（目前只有一个）完成运行，我们必须关闭 Mongoose 使用的数据库连接。这可以通过 after 方法轻松实现：
after(async () => {
  await mongoose.connection.close();
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initBlogs.length);
});

test("the first blog is about HTTP methods", async () => {
  const response = await api.get("/api/blogs");

  const authors = response.body.map((e) => e.author);
  //   assert.strictEqual(authors.includes("Michael Chan"), true);
  // 简化
  assert(authors.includes("Michael Chan"), true);
});

// 测试路由API blog 可以添加
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

// 测试来验证没有内容的blog不会保存到数据库中。

test("blog without author is not added", async () => {
  const newBlog = {
    title: "new blog 233",
    // author: "zhangsan",
    url: "https://reactpatterns.com/",
    likes: 0,
  };
  //   注意这里添加数据要使用 send方法
  // await api.post("/api/blogs").send(newBlog).expect(404);
  await api.post("/api/blogs").send(newBlog).expect(404);
  const response = await blogsInDb();
  assert.strictEqual(response.length, initBlogs.length);
});
// 编写用于获取单个blog的测试
test("get blog by id", async () => {
  // 使用接口获取所有的数据并取出其中一个
  const blogs = await blogsInDb();
  const blogAtFirst = blogs[0];

  // 通过接口获取这个数据的详情
  const viewedBlog = await api
    .get(`/api/blogs/${blogAtFirst.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
  // 对比两个是否相等
  // NB 这里是viewedBlog.body 注意是body
  // 第一个参数是真实的值 ，第二才是期望值
  assert.deepStrictEqual(viewedBlog.body, blogAtFirst);
});
// 删除单个blog的测试
test("delete blog by id", async () => {
  const blogs = await blogsInDb();
  const blogToDelete = blogs[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const afterBlogs = await blogsInDb();
  const urlList = afterBlogs.map((r) => r.url);
  assert(!urlList.includes(blogToDelete.url));

  assert.strictEqual(afterBlogs.length, initBlogs.length - 1);
});
