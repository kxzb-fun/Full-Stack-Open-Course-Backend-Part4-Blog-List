const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog.js");
const blogsRouter = require("./controllers/blogs.js");
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

blogsRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
      // logger.info(blogs[0]._id)
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

// TODO
// app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.use("/api/blogs", blogsRouter);
module.exports = app;
