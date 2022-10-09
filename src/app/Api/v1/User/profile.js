const Controller = require("../../../dbModels/1_person/User/Controller");


module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, readONE, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;

        // let {_id, select, populate} = paramObj);
        let res = await Controller.profileCT(payload, paramObj);
        
        return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
}