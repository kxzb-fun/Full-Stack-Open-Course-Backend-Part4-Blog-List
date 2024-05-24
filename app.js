const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog.js");
const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require('./controllers/users')
const config = require("./utils/config");
const middleware = require("./utils/middleware.js");
// monggodb connect
const mongoose = require("mongoose");
// 宽松模式 (strictQuery: false): 当你需要进行一些宽松的查询，可能需要在查询中包含 schema 未定义的字段时使用。
mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("succeeded to connect MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  // XXXX 为了通过测试
  if (!request.body.title || !request.body.url) {
    // NB 要加end()
    response.status(400).end();
    return;
  }
  if (request.body.likes) {
    request.body.likes = 0;
  }
  const blog = new Blog(request.body);
  const saveBlog = await blog.save();
  response.status(201).json(saveBlog);
});

// 通过id查找blog
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  console.log(blog);
  response.json(blog).end();
});

// 删除博客
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// 更新
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = { ...request.body };
  // NB 注意参数的传递
  const updateBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title,
      author,
      url,
      likes,
    },
    { new: true, runValidators: true, context: "query" }
  );
  response.json(updateBlog).end();
});

// TODO
// app.use(middleware.unknownEndpoint);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

// NB 这个要放在最后 导出之前
app.use(middleware.errorHandler);

module.exports = app;
