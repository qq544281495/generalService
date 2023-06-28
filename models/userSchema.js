const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userId: Number,
  userName: String,
  userEmail: String,
  password: String,
  mobile: String,
  job: String,
  state: {
    type: Number,
    default: 1,
  },
  role: {
    type: Number,
    default: 1,
  },
  roleList: Array,
  deptId: Array,
  createTime: {
    type: Date,
    default: Date.now(),
  },
  lastLoginTime: {
    type: Date,
    default: Date.now(),
  },
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("users", userSchema, "User");
