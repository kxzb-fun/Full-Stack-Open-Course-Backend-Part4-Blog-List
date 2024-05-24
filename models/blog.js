const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

/**
 * 处理之前的数据
 * 
[
  {
    "_id": "664c880eb03cf8439e72554e",
    "title": "new post",
    "author": "kxzzb",
    "url": "test",
    "likes": 0,
    "__v": 0
  }
]
 * 尽管Mongoose对象的_id属性看起来像一个字符串，但它实际上是一个对象，需要将其转换为字符串
 * 打印出来_id 是个字符对象 new ObjectId('664c880eb03cf8439e72554e')
 * 处理之后的数据
 * 
 * [
  {
    "title": "new post",
    "author": "kxzzb",
    "url": "test",
    "likes": 0,
    "id": "664c880eb03cf8439e72554e"
  }
]
 */
mongoose.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Blog", blogSchema);
