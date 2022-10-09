const Controller = require("../../../dbModels/2_organize/Firm/Controller");


module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, api, next);

        let payload = ctx.request.payload;
        let _id = ctx.request.body;

        let res = await Controller.removeCT(payload , _id);
        return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
}

const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户"
}