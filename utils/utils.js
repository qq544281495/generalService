const log4js = require("./log");
const jwt = require("jsonwebtoken");
// 响应状态码
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登入
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或Token过期
};

module.exports = {
  pageParam({ pageNumber = 1, pageSize = 10 }) {
    // 将字符串参数转化为数字
    pageNumber *= 1;
    pageSize *= 1;
    const skipIndex = (pageNumber - 1) * pageSize;
    return {
      pageNumber,
      pageSize,
      skipIndex,
    };
  },
  success(data = "", message = "", code = CODE.SUCCESS) {
    return {
      code,
      data,
      message,
    };
  },
  fail(message = "", code = CODE.BUSINESS_ERROR) {
    return {
      code,
      message,
    };
  },
  decoded(authorization) {
    if (authorization) {
      let token = authorization.split(" ")[1];
      return jwt.verify(token, "GeneralManage");
    }
  },
  // 递归拼接菜单树型结构
  getMenuTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i];
      if (String(item.parentId.slice().pop()) == String(id)) {
        list.push(item._doc);
      }
    }
    list.map((item) => {
      item.children = [];
      this.getMenuTree(rootList, item._id, item.children);
      if (item.children.length == 0) {
        delete item.children;
      } else if (item.children[0].menuType == 2) {
        // 快速区分菜单和按钮，用于菜单按钮权限控制
        item.action = item.children;
      }
    });
    return list;
  },

  // 递归拼接部门树型结构
  getDeptTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i];
      if (String(item.parentId.slice().pop()) == String(id)) {
        list.push(item._doc);
      }
    }
    list.map((item) => {
      item.children = [];
      this.getDeptTree(rootList, item._id, item.children);
      if (item.children.length == 0) {
        delete item.children;
      }
    });
    return list;
  },
  // 时间格式化
  formateDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    const re = /(y+)/;
    if (re.test(fmt)) {
      const t = re.exec(fmt)[1];
      fmt = fmt.replace(t, (date.getFullYear() + "").substring(4 - t.length));
    }

    const o = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    for (let k in o) {
      const regx = new RegExp("(" + k + ")");
      if (regx.test(fmt)) {
        const t = regx.exec(fmt)[1];
        fmt = fmt.replace(
          t,
          t.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  },
  CODE,
};
