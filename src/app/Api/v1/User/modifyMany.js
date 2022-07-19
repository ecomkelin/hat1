const Controller = require("../../../dbModels/1_person/User/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, api, next);

        let payload = ctx.request.payload;
        let {filter={}, update} = ctx.request.body;
        let {ids, match={}} = filter;
        let matchObj = {
            ...match,
            _id: {"$in": ids}
        }
        let res = await Controller.modifyManyCT(payload, matchObj, update);
        return global.success(ctx, res);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
}



const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户",
    pwd: {
        desp: "密码"
    }
}