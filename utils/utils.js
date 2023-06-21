const log4js = require("./log");
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
  CODE,
};
