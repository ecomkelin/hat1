const Model = require("../../../dbModels/0_role/Role/Model");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, api, next);

        if(!global.IS_DEV) return reject({status: 400, message: "只有 开发状态 才可以使用此功能"});

        let res = await Model.removeMany_Pres({})
        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}

const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户"
}