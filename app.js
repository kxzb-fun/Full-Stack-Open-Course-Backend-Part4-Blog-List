const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const logger = require("./utils/logger.js");
const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
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

// use the middleware in all routes
// app.use(middleware.userExtractor)

// use the middleware only in /api/blogs routes
// app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter);
// NB 这个要放在最后 导出之前
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
