const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require("../../../collections/0_auth/User/Controller");

module.exports = async(ctx, next) => {
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let paramObj = ctx.request.body;

        let res = await Controller.detailCT(payload, paramObj, id);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}