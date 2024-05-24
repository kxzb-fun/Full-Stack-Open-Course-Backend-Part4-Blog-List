const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user");
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware.js');

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response, next) => {
  // XXXX 为了通过测试
  if (!request.body.title || !request.body.url) {
    // NB 要加end()
    response.status(400).end();
    return;
  }
  if (request.body.likes) {
    request.body.likes = 0;
  }

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(request.body.userId);
  const user = await User.findById(decodedToken.id)

  const { title, likes, author, url } = { ...request.body };

  const blog = new Blog({ title, likes, author, url, user: user.id });
  const saveBlog = await blog.save();
  // NB  存储id
  user.blogs = user.blogs.concat(saveBlog._id);
  await user.save();
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
