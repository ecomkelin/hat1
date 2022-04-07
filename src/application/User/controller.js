const UserDS = require("./dbServer");
const resJson = require("../../resJson");

exports.add = async(ctx, next) => {
    const position = "controller User add";
    try{
        const payload = null;
        const obj = ctx.request.body;

        const res = await UserDS.create(payload, obj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// deleteOne
exports.del = async(ctx, next) => {
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
// User_edit
exports.edit = async(ctx, next) => {
    const position = "controller User edit";
    try{
        const payload = null;
        const id = ctx.request.params.id;
        const paramObj = ctx.request.body;

        const res = await UserDS.update(payload, id, paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}








// User_detail
exports.detail = async(ctx, next) => {
    const position = "controller User edit";
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
