const path = require('path');
const resJson = require(path.resolve(process.cwd(), "src/resJson"));
const DB = require("./db");

exports.create = async(ctx, next) => {
    const position = "controller User create";
    try{
        const payload = null;
        const body = ctx.request.body;

        const res = await DB.create(payload, body);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// deleteOne
exports.delete = async(ctx, next) => {
    const position = "controller User del";
    try{
        const payload = null;
        const id = ctx.request.params.id;

        const res = await DB.deleteOne(payload , id);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
// User_modify
exports.modify = async(ctx, next) => {
    const position = "controller User modify";
    try{
        const payload = null;
        const id = ctx.request.params.id;
        const body = ctx.request.body;

        const res = await DB.updateOne(payload, id, body);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}








// User_detail
exports.detail = async(ctx, next) => {
    const position = "controller User detail";
    try{
        const payload = null;
        const paramObj = ctx.request.body;

        const res = await DB.findOne(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// User_list
exports.list = async(ctx, next) => {
    const position = "controller User list";
    try{
        const payload = null;
        const paramObj = ctx.request.body;

        const res = await DB.find(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
