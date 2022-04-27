const path = require('path');
const resJson = require(path.resolve(process.cwd(), "src/resJson"));
const DB = require("./db");

exports.doc = DB.doc;
exports.Model = DB.Model;

exports.create = async(ctx, next) => {
    let position = "controller User create";
    try{
        let payload = null;
        let body = ctx.request.body;

        let res = await DB.create(payload, body);
        return resJson.all(ctx, res);
    } catch(err) {
        console.log(err)
        return resJson.errs(ctx, {position, err});
    }
};

// remove
exports.remove = async(ctx, next) => {
    let position = "controller User del";
    try{
        let payload = null;
        let id = ctx.request.params.id;

        let res = await DB.remove(payload , id);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
// User_modify
exports.modify = async(ctx, next) => {
    let position = "controller User modify";
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let body = ctx.request.body;

        let res = await DB.modify(payload, id, body);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}








// User_detail
exports.detail = async(ctx, next) => {
    let position = "controller User detail";
    try{
        let payload = null;
        let paramObj = ctx.request.body;

        let res = await DB.detail(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// User_list
exports.list = async(ctx, next) => {
    let position = "controller User list";
    try{
        let payload = null;
        let paramObj = ctx.request.body;

        let res = await DB.list(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
