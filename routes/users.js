const router = require("koa-router")();
const User = require("../models/userSchema");
const Menu = require("../models/menuSchema");
const Role = require("../models/roleSchema");
const Counter = require("../models/counterSchema");
const util = require("../utils/utils");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
router.prefix("/users");

// 登录
router.post("/login", async (ctx) => {
  try {
    const { userEmail, password } = ctx.request.body;
    let md5Password = md5(password);
    const res = await User.findOne(
      { userEmail, password: md5Password },
      { _id: 0, password: 0 }
    );
    if (res) {
      const data = res._doc;
      // 生成token;
      const token = jwt.sign(
        {
          data,
        },
        "GeneralManage",
        { expiresIn: "1d" }
      );
      data.token = token;
      ctx.body = util.success({ data });
    } else {
      ctx.body = util.fail("账号或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(`登录失败：${error.stack}`);
  }
});

// 用户列表
router.get("/list", async (ctx) => {
  try {
    const { userId, userName, state } = ctx.request.query;
    const page = util.pageParam(ctx.request.query);
    let params = {};
    if (userId) params.userId = userId;
    if (userName) params.userName = new RegExp(userName, "i");
    if (state && state != "0") params.state = state;
    // 根据条件查询用户列表
    const query = User.find(params, { _id: 0, password: 0 });
    const list = await query.skip(page.skipIndex).limit(page.pageSize);
    const total = await User.countDocuments(params);
    ctx.body = util.success(
      {
        list,
        page: {
          ...page,
          total,
        },
      },
      "获取用户列表成功"
    );
  } catch (error) {
    ctx.body = util.fail(`获取用户列表失败：${error.stack}`);
  }
});

// 删除用户
router.post("/delete", async (ctx) => {
  try {
    const { userIds } = ctx.request.body;
    const res = await User.updateMany(
      { userId: { $in: userIds } },
      { state: 2 }
    );
    if (res.matchedCount) {
      ctx.body = util.success({ nModified: res.matchedCount }, `用户删除成功`);
    } else {
      ctx.body = util.fail(res, "用户删除失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack, "用户删除失败");
  }
});

// 用户新增 | 编辑
router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;
  if (action == "add") {
    try {
      const res = await User.findOne(
        { $or: [{ userName }, { userEmail }] },
        { userName: 1, userEmail: 1 }
      );
      if (res) {
        ctx.body = util.fail(`用户已存在：${res.userName} ${res.userEmail}`);
      } else {
        const counter = await Counter.findOneAndUpdate(
          { _id: "userId" },
          { $inc: { sequence_value: 1 } }
        );
        // 需要修改保存字段new Schema
        const user = new User({
          userId: counter.sequence_value,
          userName,
          userEmail,
          password: md5("admin"),
          mobile,
          job,
          state,
          roleList,
          deptId,
        });
        user.save();
        ctx.body = util.success({ info: "用户创建成功" }, "用户创建成功");
      }
    } catch (error) {
      ctx.body = util.fail(error.stack, "用户添加失败");
    }
  } else if (action == "edit") {
    // 编辑用户
    try {
      const res = await User.findOneAndUpdate(
        { userId },
        { mobile, job, state, roleList, deptId }
      );
      ctx.body = util.success({ info: "用户更新成功" }, "用户更新成功");
    } catch (error) {
      ctx.body = util.fail(error.stack, "用户更新失败");
    }
  }
});

// 获取用户对应权限菜单
router.get("/getPermissionList", async (ctx) => {
  let authorization = ctx.request.headers.authorization;
  let { data } = util.decoded(authorization);
  let list = await getMenuList(data.role, data.roleList);
  let button = getButtonList(JSON.parse(JSON.stringify(list)));
  ctx.body = util.success({ list, button });
});

async function getMenuList(userRole, roleKeys) {
  let rootList = [];
  if (userRole == 0) {
    // 管理员
    rootList = (await Menu.find({})) || [];
  } else {
    let roleList = await Role.find({ _id: { $in: roleKeys } });
    let permissionList = [];
    roleList.map((role) => {
      let { checkedKeys, halfCheckedKeys } = role.permissionList;
      permissionList = permissionList.concat([
        ...checkedKeys,
        ...halfCheckedKeys,
      ]);
    });
    // 去重
    permissionList = [...new Set(permissionList)];
    rootList = await Menu.find({ _id: { $in: permissionList } });
  }
  return util.getMenuTree(rootList, null, []);
}

function getButtonList(list) {
  const buttonList = [];
  const deep = (array) => {
    while (array.length) {
      let item = array.pop();
      if (item.action) {
        item.action.map((item) => {
          buttonList.push(item.menuCode);
        });
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  };
  deep(list);
  return buttonList;
}

module.exports = router;
