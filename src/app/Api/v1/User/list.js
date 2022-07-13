const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require("../../../dbModels/1_person/User/Controller");
const readList = require(path.resolve(process.cwd(), "bin/config/readList"));
const api = readList.paramObj;

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resJson.api(ctx, api, next);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;
        // 通过身份， 判定前端要什么数据
        let res = await Controller.listCT(payload, paramObj);
        return resJson.success(ctx, res, next);
    } catch(e) {
        return resJson.errs(ctx, e, next);
    }
}