const router = require("koa-router")();
const Role = require("../models/RoleSchema");
const util = require("../utils/utils");
router.prefix("/roles");

router.get("/allList", async (ctx) => {
  let res = await Role.find({});
  ctx.body = util.success({ list: res });
});

module.exports = router;
