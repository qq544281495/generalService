const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const users = require("./routes/users");
const log4js = require("./utils/log");
const router = require("koa-router")();
const jwt = require("jsonwebtoken");
const koajwt = require("koa-jwt");
const util = require("./utils/utils");
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
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

app.use(async (ctx, next) => {
  await next().catch((err) => {
    if (err.status == "401") {
      ctx.body = util.fail("Token认证失败", util.CODE.AUTH_ERROR);
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

// router.get("/leave/count", (ctx) => {
//   ctx.body = "body";
// });

router.use(users.routes(), users.allowedMethods());
app.use(router.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  log4js.error(`${err.stack}`);
});

module.exports = app;
