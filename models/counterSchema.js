const mongoose = require("mongoose");
const counterSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

// 参数：模型名 模型 数据库表名
module.exports = mongoose.model("counters", counterSchema, "Counter");
