const path = require('path');
const resJson = require(path.resolve(process.cwd(), "src/resJson"));
const DB = require("./db");
const doc = DB.doc;
exports.doc = doc;
exports.Model = DB.Model;
const docPreCT = require(path.resolve(process.cwd(), "middle/docPreCT"));

exports.create = async(ctx, next) => {
    let position = "/create";
    try{
        let payload = null;
        let body = ctx.request.body;
        let message = docPreCT.createFilter(doc, body);
        if(message) return resJson.failure(ctx, {position, message});

        let res = await DB.create(payload, body);
        return resJson.all(ctx, res);
    } catch(err) {
        console.log(err)
        return resJson.errs(ctx, {position, err});
    }
};

exports.remove = async(ctx, next) => {
    let position = "/remove";
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let body = ctx.request.body;
        let message = docPreCT.removeFilter(doc, body, id);
        if(message) return resJson.failure(ctx, {position, message});

        let res = await DB.remove(payload , id);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
// User_modify
exports.modify = async(ctx, next) => {
    let position = "/modify";
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let body = ctx.request.body;
        let message = docPreCT.modifyFilter(doc, body, id);
        if(message) return resJson.failure(ctx, {position, message});

        let res = await DB.modify(payload, id, body);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}








// User_detail
exports.detail = async(ctx, next) => {
    let position = "/detail";
    try{
        let payload = null;
        let id = ctx.request.params.id;
        let paramObj = ctx.request.body;
        let message = docPreCT.detailFilter(doc, paramObj, id);
        if(message) return resJson.failure(ctx, {position, message});

        let res = await DB.detail(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// User_list
exports.list = async(ctx, next) => {
    let position = "/list";
    try{
        let payload = null;
        let paramObj = ctx.request.body;
        let message = docPreCT.listFilter(doc, paramObj);
        if(message) return resJson.failure(ctx, {position, message});

        let res = await DB.list(payload, paramObj);
        return resJson.all(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
