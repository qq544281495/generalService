const router = require("koa-router")();
const Role = require("../models/RoleSchema");
const util = require("../utils/utils");
router.prefix("/roles");

// 角色列表
router.get("/allList", async (ctx) => {
  try {
    let res = await Role.find({});
    ctx.body = util.success({ list: res });
  } catch (error) {
    ctx.body = util.fail(`获取角色列表失败：${error.stack}`);
  }
});

module.exports = router;
