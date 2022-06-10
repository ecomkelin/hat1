const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const DB = require("./UserCT");

exports.doc = DB.doc;
exports.Model = DB.Model;

exports.createPG = async(ctx, next) => {
    try{
        let payload = null;
        let crtObj = ctx.request.body;

        let res = await DB.createCT(payload, crtObj);
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

        let res = await DB.removeCT(payload , id);
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

        let res = await DB.modifyCT(payload, id, updObj);
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

        let res = await DB.detailCT(payload, paramObj, id);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}

exports.listPG = async(ctx, next) => {
    try{
        let payload = null;
        let paramObj = ctx.request.body;

        let res = await DB.listCT(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}
