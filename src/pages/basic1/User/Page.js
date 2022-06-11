const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require("../../../collections/0_auth/User/Controller");

exports.createPG = async(ctx, next) => {
    try{
        let payload = null;
        let crtObj = ctx.request.body;

        let res = await Controller.createCT(payload, crtObj);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
};

exports.removePG = async(ctx, next) => {
    try{
        let payload = null;
        let id = ctx.request.params.id;
        // let body = ctx.request.body;

        let res = await Controller.removeCT(payload , id);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}
// User_modify
exports.modifyPG = async(ctx, next) => {
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let updObj = ctx.request.body;

        let res = await Controller.modifyCT(payload, id, updObj);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}








exports.detailPG = async(ctx, next) => {
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

exports.listPG = async(ctx, next) => {
    try{
        let payload = null;
        let paramObj = ctx.request.body;

        let res = await Controller.listCT(payload, paramObj.userlistParam);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}
