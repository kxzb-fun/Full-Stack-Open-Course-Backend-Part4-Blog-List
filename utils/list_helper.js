const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    if (!blog.likes) {
      blog.likes = 0;
    }
    sum += blog.likes;
    return sum;
  }, 0);
};

const favoriteBlog = (blogs) => {
  const maxLike = Math.max(...blogs.map((blog) => blog.likes));
  const res = blogs.find((blog) => blog.likes === maxLike);
  console.log(res);
  if (res) {
    return {
      title: res.title,
      author: res.author,
      likes: res.likes,
    };
  } else {
    return null;
  }
};

const mostBlogs = (blogs) => {
  const obj = {};
  blogs.map((blog) => {
    if (obj[blog.author]) {
      obj[blog.author]++;
    } else {
      obj[blog.author] = 1;
    }
  });

  let topAuthor = "";
  let maxBlogs = 0;

  for (const author in obj) {
    if (obj[author] > maxBlogs) {
      maxBlogs = obj[author];
      topAuthor = author;
    }
  }
  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  // Use _.groupBy to group blogs by author and then use _.mapValues to calculate total likes for each author
  const authorLikes = _.mapValues(_.groupBy(blogs, "author"), (blogs) =>
    _.sumBy(blogs, "likes")
  );

  // Use _.maxBy to find the author with the most likes
  const topAuthor = _.maxBy(
    _.keys(authorLikes),
    (author) => authorLikes[author]
  );

  // Return an object containing the author with the most likes and the total likes
  return {
    author: topAuthor,
    likes: authorLikes[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
