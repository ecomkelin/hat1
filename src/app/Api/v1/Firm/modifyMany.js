const Controller = require("../../../dbModels/2_organize/Firm/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, api, next);

        let payload = ctx.request.payload;

        let paramObj = ctx.request.body;
        let res = await Controller.modifyManyCT(payload, paramObj);
        return resSUCCESS(ctx, res);
    } catch(e) {
        return resERR(ctx, e, next);
    }
}



const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户",
    pwd: {
        desp: "密码"
    }
}