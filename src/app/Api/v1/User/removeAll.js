const Model = require("../../../dbModels/1_person/User/Model");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, api, next);

        if(!IS_DEV) return reject({status: 400, errMsg: "只有 开发状态 才可以使用此功能"});

        let res = await Model.removeMany_Pres({})
        return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
}

const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户"
}