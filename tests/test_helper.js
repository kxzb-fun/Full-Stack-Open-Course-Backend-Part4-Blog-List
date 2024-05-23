const Blog = require("../models/blog");

const initBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const nonExistingId = async () => {
  const data = {
    title: "new blog 233",
    author: "zhangsan",
    url: "https://bbb.com/",
    likes: 0,
  };
  const blog = new Blog(data);
  await blog.save();
  await blog.deleteOne();
  // console.log(blog._id.toString()); //664f301a9a632d53ade3525f
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initBlogs,
  nonExistingId,
  blogsInDb,
};
