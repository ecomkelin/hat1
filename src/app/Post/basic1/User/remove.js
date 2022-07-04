const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require(path.resolve(process.cwd(), "src/app/models/0_auth/User/Controller"));

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resJson.api(ctx, api);

        let payload = ctx.request.payload;
        let body = ctx.request.body;

        let res = await Controller.removeCT(payload , body);
        return resJson.success(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}


const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户"
}