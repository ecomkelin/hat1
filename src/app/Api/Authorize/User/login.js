const path = require('path');
const Auth = require(path.resolve(process.cwd(), "src/bin/js/resProm/authrize"));
const Model = require(path.resolve(process.cwd(), "src/app/dbModels/1_person/User/Model"));

module.exports = async(ctx, next) => {
    try{
      if(ctx.request.query.api == 1) return global.api(ctx, api, next);

      let res = await Auth.login_Pres(ctx, Model);
      return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
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