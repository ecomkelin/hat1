const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require(path.resolve(process.cwd(), "src/app/collections/0_auth/User/Controller"));

module.exports = async(ctx, next) => {
    try{
        let payload = ctx.request.payload;
        let body = ctx.request.body;

        let res = await Controller.removeCT(payload , body);
        return resJson.success(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}