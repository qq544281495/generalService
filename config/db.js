const mongoose = require("mongoose");
const config = require("./index");
const log4js = require("../utils/log");

// 连接数据库
mongoose
  .connect(config.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => log4js.error(error));
// 创建数据库连接对象
const db = mongoose.connection;
db.on("error", (err) => log4js.error(err));
db.on("open", () => log4js.info("数据库连接成功"));
