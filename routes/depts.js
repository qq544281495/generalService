const router = require("koa-router")();
const Dept = require("../models/deptSchema");
const util = require("../utils/utils");
router.prefix("/dept");

// 部门列表
router.get("/list", async (ctx) => {
  try {
    let { deptName } = ctx.request.query;
    let params = {};
    if (deptName) {
      params.deptName = new RegExp(deptName, "i");
      let list = await Dept.find(params);
      ctx.body = util.success({ list });
    } else {
      let list = await Dept.find(params);
      let tree = util.getDeptTree(list, null, []);
      ctx.body = util.success({ list: tree });
    }
  } catch (error) {
    ctx.body = util.fail(`获取部门列表失败：${error.stack}`);
  }
});

// 创建 | 编辑 | 删除部门
router.post("/operate", async (ctx) => {
  try {
    const { _id, action, ...params } = ctx.request.body;
    let info = "";
    if (action == "create") {
      // 创建
      await Dept.create(params);
      info = "部门创建成功";
    } else if (action == "edit") {
      // 编辑
      params.updateTime = new Date();
      await Dept.findByIdAndUpdate(_id, params);
      info = "部门更新成功";
    } else if (action == "delete") {
      // 删除
      await Dept.findByIdAndRemove(_id);
      await Dept.deleteMany({ parentId: { $all: [_id] } });
      info = "部门删除成功";
    }
    ctx.body = util.success({ info }, info);
  } catch (error) {
    ctx.body = util.fail(`操作部门失败：${error.stack}`);
  }
});

module.exports = router;
