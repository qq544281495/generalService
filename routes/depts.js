const router = require("koa-router")();
const Dept = require("../models/deptSchema");
const util = require("../utils/utils");
router.prefix("/dept");

// 部门列表
router.get("/list", async (ctx) => {
  try {
    let res = await Dept.find({});
    ctx.body = util.success({ list: res });
  } catch (error) {
    ctx.body = util.fail(`获取部门列表失败：${error.stack}`);
  }
});

module.exports = router;
