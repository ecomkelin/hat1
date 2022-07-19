const Controller = require("../../../dbModels/1_person/User/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, api, next);

        let payload = ctx.request.payload;
        let crtObj = ctx.request.body;
        let res = await Controller.initCT(payload, crtObj);
        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
};



const api = {
    description: "一般情况不可用",
    code: {
        desp: "账号, 不能有相同的账号",
        required: true,
        regular: "",
        maxLen: 12,
        minLen: 4,
    },
    pwd: {
        desp: "密码"
    }
}