const router = require("koa-router")();
const Menu = require("../models/menuSchema");
const util = require("../utils/utils");
router.prefix("/menu");

// 获取菜单列表
router.get("/list", async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  if (menuName) params.menuName = new RegExp(menuName, "i");
  if (menuState) params.menuState = menuState;
  if (menuName || menuState) {
    let list = await Menu.find(params);
    ctx.body = util.success({ list });
  } else {
    let list = await Menu.find(params);
    let tree = util.getMenuTree(list, null, []);
    ctx.body = util.success({ list: tree });
  }
});

// 创建 | 编辑 | 删除菜单
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  let info = "";
  try {
    if (action == "create") {
      await Menu.create(params);
      info = "菜单创建成功";
    } else if (action == "edit") {
      params.updateTime = new Date();
      await Menu.findByIdAndUpdate(_id, params);
      info = "菜单更新成功";
    } else if (action == "delete") {
      await Menu.findByIdAndRemove(_id);
      await Menu.deleteMany({ parentId: { $all: [_id] } });
      info = "菜单删除成功";
    }
    ctx.body = util.success({ info }, info);
  } catch (error) {
    ctx.body = util.fail(`操作菜单失败：${error.stack}`);
  }
});

module.exports = router;
