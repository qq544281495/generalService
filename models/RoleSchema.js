const mongoose = require("mongoose");
const RoleSchema = mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: {
    checkedKeys: [],
    halfCheckedKeys: [],
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("roles", RoleSchema, "Role");
