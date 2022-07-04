const path = require('path');
const Auth = require(path.resolve(process.cwd(), "src/bin/res/auth"));
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));

const Model = require(path.resolve(process.cwd(), "src/app/models/0_auth/User/Model"));

module.exports = async(ctx, next) => {
    try{
      if(ctx.request.query.api == 1) return resJson.api(ctx, api);

      let res = await Auth.refresh_Pres(ctx, Model)
      return resJson.success(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
};


const api = {
  description: "您的身份必须为管理者 以上 才能创建新用户",
  code: {
      desp: "账号, 不能有相同的账号",
      required: true,
      regular: "",
      maxLen: 12,
      minLen: 4,
  },
  pwd: {
      desp: "密码"
  }
}