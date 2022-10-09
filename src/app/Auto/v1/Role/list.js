const Controller = require("../../../dbModels/0_role/Role/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, readMANY, next);

        let payload = ctx.request.payload;

        let paramObj = ctx.request.body;
        // 通过身份， 判定前端要什么数据
        let res = await Controller.listCT(payload, paramObj);
        return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
}