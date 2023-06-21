const router = require("koa-router")();
const User = require("../models/userSchema");
const util = require("../utils/utils");
const jwt = require("jsonwebtoken");
router.prefix("/users");

router.post("/login", async (ctx) => {
  try {
    const { userName, password } = ctx.request.body;
    const res = await User.findOne(
      { userName, password },
      "userId userName userEmail job mobile state role roleList deptId createTime lastLoginTime"
    );
    if (res) {
      const data = res._doc;
      // 生成token;
      const token = jwt.sign(
        {
          data,
        },
        "GeneralManage",
        { expiresIn: "1h" }
      );
      data.token = token;
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("账号或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
