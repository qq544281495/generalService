const mongoose = require("mongoose");
const menuSchema = mongoose.Schema({
  parentId: Array,
  updateTime: String,
  createTime: String,
  menuType: Number,
  menuName: String,
  menuCode: String,
  path: String,
  icon: String,
  order: String,
  component: String,
  menuState: Number,
  children: Array,
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("menus", menuSchema, "Menu");
