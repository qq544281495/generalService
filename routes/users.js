const router = require("koa-router")();
const User = require("../models/userSchema");
const util = require("../utils/utils");
router.prefix("/users");

router.post("/login", async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    const res = await User.findOne({ username, password });
    if (res) {
      ctx.body = util.success(res);
    } else {
      ctx.body = util.fail("账号或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
