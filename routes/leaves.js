const router = require("koa-router")();
const Leave = require("../models/leaveSchema");
const Dept = require("../models/deptSchema");
const util = require("../utils/utils");
router.prefix("/leave");

router.get("/list", async (ctx) => {
  try {
    const { applyState } = ctx.request.query;
    const page = util.pageParam(ctx.request.query);
    let params = {};
    if (applyState) params.applyState = applyState;
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization);
    let deptId = data.deptId.slice(-1);
    let deptInfo = await Dept.findById(deptId);
    // 所有休息信息仅限管理员和人事部门人员查看
    if (data.role != 0 && deptInfo.deptName != "人事部门") {
      params["applyUser.userId"] = data.userId;
    }
    const query = Leave.find(params);
    const list = await query.skip(page.skipIndex).limit(page.pageSize);
    const total = await Leave.countDocuments(params);
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total,
      },
    });
  } catch (error) {
    ctx.body = util.fail(`获取休假列表失败：${error.stack}`);
  }
});

router.post("/operate", async (ctx) => {
  try {
    const { _id, action, ...params } = ctx.request.body;
    if (action == "create") {
      let authorization = ctx.request.headers.authorization;
      let { data } = util.decoded(authorization);
      let users = [];
      // 休假申请人
      params.applyUser = {
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      };
      // 生成休假单号
      let orderNo = "XJ";
      orderNo += util.formateDate(new Date(), "yyyyMMdd");
      const total = await Leave.countDocuments();
      params.orderNo = orderNo + total;
      // 获取部门负责人
      let deptId = data.deptId.slice(-1);
      let deptUser = await Dept.findById(deptId);
      users.push(deptUser);
      // 获取人事部门负责人
      let personnelUser = await Dept.find({ deptName: "人事部门" });
      users.push(personnelUser[0]);
      // 获取公司负责人
      let bossUser = await Dept.find({ deptName: "珠海识卓科技有限公司" });
      users.push(bossUser[0]);
      // 创建审批流 & 审批人员
      params.auditFlows = [];
      auditUsers = [];
      for (let item of users) {
        params.auditFlows.push({
          userId: item.userId,
          userName: item.userName,
          userEmail: item.userEmail,
        });
        auditUsers.push(item.userName);
      }
      // 去重
      auditUsers = [...new Set(auditUsers)];
      params.auditUsers = auditUsers.join(",");
      // 审批日志
      params.auditLogs = [];
      // 当前审批人
      params.curAuditUserName = deptUser.userName;
      await Leave.create(params);
      ctx.body = util.success({ info: "休假申请成功" }, "休假申请成功");
    } else if (action == "delete") {
      await Leave.findByIdAndUpdate(_id, { applyState: 5 });
      ctx.body = util.success({ info: "休假作废成功" }, "休假作废成功");
    }
  } catch (error) {
    ctx.body = util.fail(`操作休假失败：${error.stack}`);
  }
});

router.get("/ratify", async (ctx) => {
  try {
    const { checkState } = ctx.request.query;
    const page = util.pageParam(ctx.request.query);
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization);
    let params = { userId: data.userId };
    if (checkState) params.checkState = checkState;
    const query = Leave.find({ auditFlows: { $elemMatch: params } })
      .where("applyState")
      .ne(5);
    const list = await query.skip(page.skipIndex).limit(page.pageSize);
    const total = await Leave.countDocuments(params);
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total,
      },
    });
  } catch (error) {
    ctx.body = util.fail(`获取休假审批列表失败：${error.stack}`);
  }
});

router.post("/ratify/leave", async (ctx) => {
  try {
    const { _id, auditFlows, action, remark } = ctx.request.body;
    let info = "";
    let authorization = ctx.request.headers.authorization;
    let { data } = util.decoded(authorization);
    let index = auditFlows.findIndex((item) => item.userId == data.userId);
    // 下一级审批流人员
    let nextAudit = auditFlows[index + 1];
    // 审批日志
    let log = {
      userId: data.userId,
      userName: data.userName,
      createTime: Date.now(),
      remark,
      action,
    };
    if (action === "succeed") {
      auditFlows[index].checkState = 1;
      if (index === auditFlows.length - 1) {
        // 所有审批流结束且都为审批通过
        await Leave.findByIdAndUpdate(_id, {
          applyState: 4,
          auditFlows,
          $push: { auditLogs: log },
        });
      } else {
        await Leave.findByIdAndUpdate(_id, {
          applyState: 2,
          curAuditUserName: nextAudit.userName,
          auditFlows,
          $push: { auditLogs: log },
        });
      }
      info = "审批已通过";
    } else if (action === "fail") {
      // 审批拒绝则将审批流后续人员删除
      auditFlows[index].checkState = 2;
      auditFlows.splice(index + 1);
      await Leave.findByIdAndUpdate(_id, {
        applyState: 3,
        auditFlows,
        $push: { auditLogs: log },
      });
      info = "审批已拒绝";
    }
    ctx.body = util.success({ info }, info);
  } catch (error) {
    ctx.body = util.fail(`审批休假申请失败：${error.stack}`);
  }
});

module.exports = router;
