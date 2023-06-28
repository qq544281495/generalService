const router = require("koa-router")();
const Menu = require("../models/menuSchema");
const util = require("../utils/utils");
router.prefix("/menu");

router.get("/list", async (ctx) => {
  let res = await Menu.find({});
  ctx.body = util.success(res);
});

module.exports = router;
