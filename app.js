const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const log4js = require("./utils/log");
const router = require("koa-router")();
const koajwt = require("koa-jwt");
const util = require("./utils/utils");
// 路由
const users = require("./routes/users");
const menus = require("./routes/menus");
const roles = require("./routes/roles");
const depts = require("./routes/depts");
const leaves = require("./routes/leaves");
require("./config/db");
// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());

app.use(async (ctx, next) => {
  await next().catch((err) => {
    if (err.status == "401") {
      ctx.body = util.fail("身份验证失败，请重新登录", util.CODE.AUTH_ERROR);
    } else {
      throw err;
    }
  });
});
// token身份验证
app.use(
  koajwt({ secret: "GeneralManage" }).unless({
    path: [/^\/api\/users\/login/],
  })
);
// routes
router.prefix("/api");

router.use(users.routes(), users.allowedMethods());
router.use(menus.routes(), menus.allowedMethods());
router.use(roles.routes(), roles.allowedMethods());
router.use(depts.routes(), depts.allowedMethods());
router.use(leaves.routes(), leaves.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  log4js.error(`${err.stack}`);
});

module.exports = app;
