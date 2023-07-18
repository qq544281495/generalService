const mongoose = require("mongoose");
const leaveSchema = mongoose.Schema({
  orderNo: String,
  applyType: Number,
  startTime: { type: Date, default: Date.now() },
  endTime: { type: Date, default: Date.now() },
  applyUser: {
    userId: String,
    userName: String,
    userEmail: String,
  },
  leaveTime: String,
  reasons: String,
  auditUsers: String,
  curAuditUserName: String,
  auditFlows: [
    {
      userId: String,
      userName: String,
      userEmail: String,
      checkState: { type: Number, default: 0 },
    },
  ],
  auditLogs: [
    {
      userId: String,
      userName: String,
      createTime: Date,
      remark: String,
      action: String,
    },
  ],
  applyState: { type: Number, default: 1 },
  createTime: { type: Date, default: Date.now() },
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("leaves", leaveSchema, "Leave");
