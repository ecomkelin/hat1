const Controller = require("../../../dbModels/1_person/User/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, api, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;

        // let {_id, update} = paramObj;
        let res = await Controller.modifyCT(payload, paramObj);
        return global.success(ctx, res);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}



const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户",
    pwd: {
        desp: "密码"
    }
}