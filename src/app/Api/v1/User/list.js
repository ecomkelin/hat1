const Controller = require("../../../dbModels/1_person/User/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, global.readList, next);

        let payload = ctx.request.payload;

        let paramObj = ctx.request.body;
        // 通过身份， 判定前端要什么数据
        let res = await Controller.listCT(payload, paramObj);
        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}