const UserDS = require("./dbServer");
const resJson = require("../../resJson");

exports.create = async(ctx, next) => {
    const position = "controller User create";
    try{
        const payload = null;
        const body = ctx.request.body;

        const res = await UserDS.create(payload, body);
        return resJson.success(ctx, res);
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

        const res = await UserDS.deleteOne(payload , id);
        return resJson.success(ctx, res);
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

        const res = await UserDS.update(payload, id, body);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}








// User_detail
exports.detail = async(ctx, next) => {
    const position = "controller User detail";
    try{
        const payload = null;
        const id = ctx.request.params.id;
        const paramObj = ctx.request.body;

        const res = await UserDS.findOne(payload, id, paramObj);
        return resJson.success(ctx, res);
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

        const res = await UserDS.find(payload, paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
