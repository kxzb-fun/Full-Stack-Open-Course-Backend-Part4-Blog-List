const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");
const supertest = require("supertest");
const assert = require("node:assert");
const { test, describe, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const { usersInDb } = require("./test_helper");

const app = require("../app");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  const api = supertest(app);
  // 测试创建新用户
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  // NB
  // 4.16 implement tests that ensure invalid users are not created and that an invalid add user operation returns a suitable status code and error message.
  test("ensure invalid users are not created invalid username", async () => {
    // 获取所有用户的长度
    const users = await User.find({});
    // 添加非法的新用户 期待错误的状态码
    const invalidUser = {
      username: "qw",
      password: "123",
      name: "qw",
    };
    await api.post("/api/users").send(invalidUser).expect(400);
    // 验证用户长度没变
    const newUsers = await User.find({});
    assert.strictEqual(newUsers.length, users.length);
  });
  test("ensure invalid users are not created invalid password", async () => {
    // 获取所有用户的长度
    const users = await User.find({});
    // 添加非法的新用户 期待错误的状态码
    const invalidUser = {
      username: "qwww",
      password: "12",
      name: "qw",
    };
    await api.post("/api/users").send(invalidUser).expect(400);
    // 验证用户长度没变
    const newUsers = await User.find({});
    assert.strictEqual(newUsers.length, users.length);
  });
  // 4.23 write a new test to ensure adding a blog fails with the proper status code 401 Unauthorized if a token is not provided.
  test("token is not provided, adding a blog fails with the proper status code 401 Unauthorized", async () => {
    // 获取所有用户的长度
    const blogs = await Blog.find({});
    // 不传递token
    const blog = {
      title: "qwww",
      author: "123456",
      url: "fjhjsdjs",
      likes:0,
    };
    await api.post("/api/blogs").send(blog).expect(401);
    // 验证用户长度没变
    const newBlogs = await Blog.find({});
    assert.strictEqual(newBlogs.length, blogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
