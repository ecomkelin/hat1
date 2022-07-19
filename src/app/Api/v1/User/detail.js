const Controller = require("../../../dbModels/1_person/User/Controller");


module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, global.readDetail, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;
        paramObj.match = {_id: paramObj._id};
        delete paramObj._id;
        // let {match, select, populate} = paramObj);
        let res = await Controller.detailCT(payload, paramObj);
        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}