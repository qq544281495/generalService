const router = require("koa-router")();
const Dept = require("../models/deptSchema");
const util = require("../utils/utils");
router.prefix("/dept");

router.get("/list", async (ctx) => {
  let res = await Dept.find({});
  ctx.body = util.success({ list: res });
});

module.exports = router;
