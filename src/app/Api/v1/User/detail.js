const Controller = require("../../../dbModels/1_person/User/Controller");


module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, global.readDetail, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;

        // let {_id, select, populate} = paramObj);
        let res = await Controller.detailCT(payload, paramObj);
        
        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}