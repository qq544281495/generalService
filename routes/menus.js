const router = require("koa-router")();
const Menu = require("../models/menuSchema");
const util = require("../utils/utils");
router.prefix("/menu");

// 获取菜单列表
router.get("/list", async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  let rootList = (await Menu.find(params)) || [];
  const list = getTreeMenu(rootList, null, []);
  ctx.body = util.success(list);
});

// 递归拼接树型结构
function getTreeMenu(rootList, id, list) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i];
    if (String(item.parentId.slice().pop()) == String(id)) {
      list.push(item._doc);
    }
  }
  list.map((item) => {
    item.children = [];
    getTreeMenu(rootList, item._id, item.children);
    if (item.children.length == 0) {
      delete item.children;
    } else if (item.children[0].menuType == 2) {
      // 快速区分菜单和按钮，用于菜单按钮权限控制
      item.action = item.children;
    }
  });
  return list;
}

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
    ctx.body = util.fail(`编辑菜单失败：${error.stack}`);
  }
});

module.exports = router;
