const Controller = require("../../../dbModels/0_role/Role/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resAPI(ctx, api, next);

        let payload = ctx.request.payload;
        let crtObj = ctx.request.body;

        let res = await Controller.createManyCT(payload, crtObj);
        return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
};



const api = {
    description: "您的身份必须为管理者 以上 才能创建新用户",
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