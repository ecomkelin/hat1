const {encryptHash_Pstr, matchBcrypt_Pnull} = require(path.resolve(process.cwd(), "bin/js/encryption/bcrypt"));

const {pass_Pnull} = require(path.resolve(process.cwd(), "bin/js/db/writePre"));
const {format_phoneInfo} = require("../FN_group");

const Model = require("./Model");


/**
 * 如果有返回值 则 无权限写入数据
 * @param {*} payload 
 * @param {*} docObj 
 * @returns 
 */
const noAuth_write = (payload, docObj) => {
    if(!docObj) return "请输入 update 参数";
    if(!payload.rankNum) return "您的 payload 信息错误, 请检查您的 token信息";

    if(payload.is_admin !== true) {
        if(docObj.Roles) {
            for(let i=0; i<docObj.Roles.length; i++) {
                let j = 0;
                for(; j<payload.Roles.length; i++) {
                    if(docObj.Roles[i] === payload.Roles[j]._id) break;
                }
                if(j === payload.Roles.length) return `payload 角色中不包含 ${payload.Roles[i]} 这个角色, 所以不能给新用户添加此角色`;
            }
        }
        if(docObj.auths) {
            for(let i=0; i<docObj.auths.length; i++) {
                let j = 0;
                for(; j<payload.auths.length; j++) {
                    if(docObj.auths[i] === payload.auths[j]) break;
                }
                if(j === payload.auths.length) return `payload 权限中 不包含 ${payload.auths[i]} 这个权限, 所以不能给新用户添加此权限`;
            }
        }
        if(docObj.rankNum && docObj.rankNum >= payload.rankNum) return "只可以添加等级比自己低的 rankNum";
    }
}




/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        // if(!docObj.Roles) return reject({status: 400, errMsg: "请传递 用户角色"});
        if(!docObj.auths) docObj.auths = [];
        // 有无权限 完成新数据
        let errMsg = noAuth_write(payload, docObj);
        if(errMsg) return reject({status: 400, errMsg});
        
        // 查看 前台数据 docObj 正确性 并且 对 is_change is_auto 数据的处理
        await pass_Pnull(false, Model.doc, docObj, payload);
        let is_pass = true;
        
        // is_change is_auto 数据自动处理处;
        docObj.pwd = await encryptHash_Pstr(docObj.pwd);
        format_phoneInfo(docObj);
        if(payload.Firm && payload.Firm._id) {
            docObj.Firm = payload.Firm._id;
        }
        
        // 写入
        let res = await Model.create_Pres(docObj, {is_pass});
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs=[]) => new Promise(async(resolve, reject) => {
    try{
        // if(!docObj.Roles) return reject({status: 400, errMsg: "请传递 用户角色"});
        let errMsg = null;
        for(let i=0; i<docObjs.length; i++) {
            let docObj = docObjs[i];
            if(!docObj.auths) docObj.auths = [];
            // 有无权限 完成新数据
            errMsg = noAuth_write(payload, docObj);
            if(errMsg) return reject({status: 400, errMsg});

            // 查看 前台数据 docObj 正确性 并且 对 is_change is_auto 数据的处理
            await pass_Pnull(false, Model.doc, docObj, payload);

            // is_change is_auto 数据自动处理处;
            docObj.pwd = await encryptHash_Pstr(docObj.pwd);
            format_phoneInfo(docObj);
        }

        // 是否重复 在此添加

        let res = await Model.createMany_Pres(docObjs);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


// 把 payload 加入match中, 以免操作了 非本公司的数据
const setMatch = (payload, match) => {
    if(!payload.rankNum) return "您的 payload 信息错误, 请检查您的 token信息";
    match.rankNum = {"$lt": payload.rankNum};                           // 把没有权限修改的用户过滤掉

    // 如果是公司用户 则只可修改本公司的用户
    if(payload.Firm) match.Firm = payload.Firm._id || payload.Firm;
}
exports.modifyCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {_id, update} = paramObj;

        // 有无权限 完成新数据
        let errMsg = noAuth_write(payload, update);
        if(errMsg) return reject({status: 400, errMsg});

        let match = {_id: _id};
        setMatch(payload, match);

        Org = await Model.detail_Pobj({match});

        let flag_change = false;
        if(update.pwd) {
            flag_change = true;
        } else {
            for(key in update) {
                if(Model.doc[key].is_change) continue;
                if(update[key] !== Org[key]) {
                    flag_change = true;
                }
            }
        }
        if(!flag_change) return reject({status: 400, errMsg: "您没有修改任何数据"});

        // is_change is_auto 操作前的 数据的验证
        let is_modify_writePre = true;
        await pass_Pnull(is_modify_writePre, Model.doc, update, payload);
        let is_pass = true; // 已经通过了数据验证, 不需要再进行验证

        // is_change is_auto 数据自动处理处;
        if(update.pwd) update.pwd = await encryptHash_Pstr(update.pwd);
        format_phoneInfo(update, Org);

        // 修改数据
        let res = await Model.modify_Pres(match, update, is_pass);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});
exports.myselfPutCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {update, pwdOrg} = paramObj;
        if(!update) return reject({status: 400, errMsg: "请输入 update 参数"});
        // 有无权限 完成新数据
        let errMsg = noAuth_write(payload, update);
        if(errMsg) return reject({status: 400, errMsg});

        let match = {_id: payload._id};

        Org = await Model.findOne_Pobj({match});    // 因为要看 pwd 所以不能用 detail_Pobj
        if(!Org) return reject({status: 400, errMsg: "您的数据已经不在数据库中"})

        let flag_change = false;
        if(update.pwd) {
            flag_change = true;
        } else {
            for(key in update) {
                if(Model.doc[key].is_change) continue;
                if(update[key] !== Org[key]) {
                    flag_change = true;
                }
            }
        }
        if(!flag_change) return reject({status: 400, errMsg: "您没有修改任何数据"});

        // is_change is_auto 操作前的 数据的验证
        let is_modify_writePre = true;  // 标识这是更新而不是新建
        await pass_Pnull(is_modify_writePre, Model.doc, update, payload);
        let is_pass = true; // 已经通过了数据验证, 不需要再进行验证

        // is_change is_auto 数据自动处理处;
        if(update.pwd) {
            if(!pwdOrg) return reject({status: 400, errMsg: "请输入您的原密码, 如果忘记请联系管理员"})
            await matchBcrypt_Pnull(pwdOrg, Org.pwd);
            update.pwd = await encryptHash_Pstr(update.pwd);
        }
        format_phoneInfo(update, Org);

        // 修改数据
        let res = await Model.modify_Pres(match, update, is_pass);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, paramObj) => new Promise(async(resolve, reject) => {
    try{
        let {update} = paramObj;
        if(!update) return reject({status: 400, errMsg: "请传递 update 数据"});
        let match = {};
        setMatch(payload, match);
        paramObj.match = match;
        // 不可批量修改的数据
        delete update.pwd;
        delete update.phonePre;
        delete update.img_url;

        // is_change is_auto 操作前的 数据的验证
        let is_modify_writePre = true;
        await pass_Pnull(is_modify_writePre, Model.doc, update, payload);

        let res = await Model.modifyMany_Pres(paramObj, update);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.removeCT = (payload, _id) => new Promise(async(resolve, reject) => {
    try{
        let match = {_id: _id};
        setMatch(payload, match);

        let Org = await Model.detail_Pobj({match});
        // 判断数据 如果需要 比如关联删除 是否能够删除

        /* 删除数据 */
        let del = await Model.remove_Pres(match)
        return resolve(del);
    } catch(e) {
        return reject(e);
    }
});

exports.removeManyCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let match = {};
        setMatch(payload, match);
        paramObj.match = match;

        /* 删除数据 */
        let dels = await Model.removeMany_Pres(paramObj)

        /* 返回 */
        return resolve(dels);
    } catch(e) {
        return reject(e);
    }
});












exports.profileCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try {
        let {select, populate} = paramObj;

        paramObj.match = {_id: payload._id};
        // let {match, select, populate} = paramObj);
        let object = await Model.detail_Pobj(paramObj);
        return resolve({message: "数据读取成功", data:{object}});
    } catch(e) {
        return reject(e);
    }
})

exports.detailCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {_id, match={}, select, populate} = paramObj;

        // 根据 payload 过滤 match select
        if(_id) match._id = _id;

        setMatch(payload, match);
        paramObj.match = match;

        // let {match, select, populate} = paramObj);
        let object = await Model.detail_Pobj(paramObj);
        return resolve({message: "数据读取成功", data:{object}});
    } catch(e) {
        return reject(e);
    }
});

exports.listCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 根据 payload 过滤 match select
        let {filter = {}} = paramObj;
        let {match = {}} = filter;
        setMatch(payload, match);
        match.rankNum = {"$lte": payload.rankNum};   // 特殊

        let res = await Model.list_Pres(paramObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});