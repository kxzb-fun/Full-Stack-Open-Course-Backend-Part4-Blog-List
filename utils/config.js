// environment variables is extracted into a separate file
// 使用dotenv这个库，识别目录下的 .env文件来读取环境变量
require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
