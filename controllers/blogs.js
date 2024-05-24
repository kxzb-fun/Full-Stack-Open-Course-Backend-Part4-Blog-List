const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");

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

module.exports = blogsRouter;
