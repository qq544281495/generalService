const mongoose = require("mongoose");
const deptSchema = mongoose.Schema({
  parentId: Array,
  updateTime: String,
  createTime: String,
  _id: String,
  deptName: String,
  userId: String,
  userName: String,
  userEmail: String,
  __v: Number,
  children: Array,
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("depts", deptSchema, "Dept");
