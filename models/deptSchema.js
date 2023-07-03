const mongoose = require("mongoose");
const deptSchema = mongoose.Schema({
  parentId: [mongoose.Types.ObjectId],
  deptName: String,
  userId: String,
  userName: String,
  userEmail: String,
  updateTime: {
    type: Date,
    default: Date.now(),
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("depts", deptSchema, "Dept");
