const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require("../../../Models/0_auth/User/Controller");
const readDetail = require(path.resolve(process.cwd(), "bin/config/readDetail"));
const api = readDetail.paramObj;

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resJson.api(ctx, api, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;

        let res = await Controller.detailCT(payload, paramObj);
        return resJson.success(ctx, res, next);
    } catch(e) {
        return resJson.errs(ctx, e, next);
    }
}