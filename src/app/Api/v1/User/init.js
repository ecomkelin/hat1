const Model = require("../../../dbModels/1_person/User/Model");
const {encryptHash_Pstr} = require(global.path.resolve(process.cwd(), "src/bin/payload/bcrypt"));

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return global.api(ctx, api, next);

        if(!global.IS_DEV) return reject({status: 400, message: "只有 开发状态 才可以使用此功能"});

        let docObj = ctx.request.body;

        // 查看是否已经有了 is_admin
        let Org = await Model.findOne_Pobj({match: {is_admin: true}, projection: {code: 1}});   // 没有match._id 所以不能用 detail_Pobj
        if(Org) return reject({status: 400, message: `本系统已经有超级管理员 [${Org.code}], 如果您忘记密码, 请从数据库删除重新添加`});

        if(!docObj.pwd) return reject({status: 400, message: "User init: 请输入超级管理员的密码 "});
        docObj.pwd = await encryptHash_Pstr(docObj.pwd);

        docObj.is_admin = true;
        docObj.rankNum = 10;

        let res = await Model.create_Pres(docObj);

        return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
};



const api = {
   
}