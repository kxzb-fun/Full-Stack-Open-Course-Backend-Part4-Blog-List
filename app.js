const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog.js");

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
    // logger.info(blogs[0]._id)
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = app;
