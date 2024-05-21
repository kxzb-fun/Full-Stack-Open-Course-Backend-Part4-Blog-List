const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog.js");
const blogsRouter = require('./controllers/blogs.js')
app.use(cors());
app.use(express.json());

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
    // logger.info(blogs[0]._id)
  });
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  }).catch(error=>console.log(error))
});

app.use('/api/blogs', blogsRouter)
module.exports = app;