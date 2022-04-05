const UserDS = require("./dbServer");
const resJson = require("../../resJson");

exports.create = async(ctx, next) => {
    const position = "controller User create";
    try{
        const payload = null;
        const obj = ctx.request.body;

        const res = await UserDS.post_User(payload, obj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// delete_User
exports.delete = async(ctx, next) => {
    const position = "controller User delete";
    try{
        const payload = null;
        const id = ctx.request.params.id;

        const res = await UserDS.delete_User(payload , id);
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

        const res = await UserDS.put_User(payload, id, paramObj);
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

        const res = await UserDS.get_User(payload, id, paramObj);
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

        const res = await UserDS.get_UserMany(payload, paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}
