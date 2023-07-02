const router = require("koa-router")();
const Role = require("../models/RoleSchema");
const util = require("../utils/utils");
router.prefix("/roles");

// 角色列表
router.get("/list", async (ctx) => {
  try {
    const { roleName } = ctx.request.query;
    const page = util.pageParam(ctx.request.query);
    let params = {};
    if (roleName) params.roleName = roleName;
    const query = Role.find(params);
    const list = await query.skip(page.skipIndex).limit(page.pageSize);
    const total = await Role.countDocuments(params);
    ctx.body = util.success(
      {
        list,
        page: {
          ...page,
          total,
        },
      },
      "获取角色列表成功"
    );
  } catch (error) {
    ctx.body = util.fail(`获取角色列表失败：${error.stack}`);
  }
});

// 创建 | 编辑 | 删除角色
router.post("/operate", async (ctx) => {
  try {
    const { _id, action, ...params } = ctx.request.body;
    let info = "";
    if (action == "create") {
      // 创建角色
      await Role.create(params);
      info = "角色创建成功";
    } else if (action == "edit") {
      // 编辑角色
      await Role.findByIdAndUpdate(_id, params);
      info = "角色编辑成功";
    } else if (action == "delete") {
      // 删除角色
      await Role.findByIdAndRemove(_id);
      info = "角色删除成功";
    }
    ctx.body = util.success({ info }, info);
  } catch (error) {
    ctx.body = util.fail(`操作角色列表失败：${error.stack}`);
  }
});

// 更新角色权限
router.post("/update/permission", async (ctx) => {
  try {
    let { _id, permissionList } = ctx.request.body;
    let res = await Role.findByIdAndUpdate(_id, { permissionList });
    ctx.body = util.success({ info: "更新角色权限成功" });
  } catch (error) {
    ctx.body = util.fail(`更新角色权限失败：${error.stack}`);
  }
});

module.exports = router;
