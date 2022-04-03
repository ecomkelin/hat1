const UserDS = require("../dbServer/User");
const resJson = require("../../resJson");

exports.create = async(ctx, next) => {
    const position = "controller User create";
    try{
        const payload = null;
        const obj = ctx.request.body;

        const res = await UserDS.User_create(payload, obj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// User_delete
exports.delete = async(ctx, next) => {
    const position = "controller User delete";
    try{
        const payload = null;
        const id = ctx.request.params.id;

        const res = await UserDS.User_delete(payload , id);
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

        const res = await UserDS.User_put(payload, id, paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

exports.delMany = async(ctx, next) => {
    const position = "controller User delMany";
    try{
        const payload = null;
        const paramObj = ctx.request.body;
        const {matchObj = {}} = paramObj;

        const res = await UserDS.User_delMany(payload, matchObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// User_info
exports.info = async(ctx, next) => {
    const position = "controller User info";
    try{
        const payload = null;
        const id = ctx.request.params.id;
        const paramObj = ctx.request.body;

        const res = await UserDS.User_get(payload, id, paramObj);
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

        const res = await UserDS.User_getMany(payload, paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
