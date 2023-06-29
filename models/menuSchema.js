const mongoose = require("mongoose");
const menuSchema = mongoose.Schema({
  menuType: Number,
  menuName: String,
  menuCode: String,
  menuState: Number,
  path: String,
  icon: String,
  order: Number,
  component: String,
  parentId: [mongoose.Types.ObjectId],
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("menus", menuSchema, "Menu");
