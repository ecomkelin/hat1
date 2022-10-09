const {pass_Pnull} = require(path.resolve(process.cwd(), "bin/js/db/writePre"));

const Model = require("./Model");


// 有无权限 完成 这部分字段的修改
const noAuth_write = (payload, docObj) => {
    if(!docObj) return "请输入 操作字段";
    if(!payload.rankNum) return "您的 payload 信息错误, 请检查您的 token信息";

    // 判断 payload身份 Model中的什么字段不能被 payload 权限修改
}



/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        if(payload.Firm) return "您无权添加一个新的公司, 请联系管理员";

        // 有无权限 添加 这部分字段
        let errMsg = noAuth_write(payload, docObj);
        if(errMsg) return reject({status: 400, errMsg});

        // 查看 前台数据 docObj 正确性 并且 对 is_change is_auto 数据的处理
        await pass_Pnull(false, Model.doc, docObj, payload);
        let is_pass = true;

        // is_change is_auto 数据自动处理处;

        // 写入
        let res = await Model.create_Pres(docObj, {is_pass});
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.createManyCT = (payload, docObjs=[]) => new Promise(async(resolve, reject) => {
    try{
        if(payload.Firm) return "您无权添加新的公司, 请联系管理员";

        let errMsg = null;
        for(let i=0; i<docObjs.length; i++) {
            let docObj = docObjs[i];
            // 有无权限 完成新数据
            errMsg = noAuth_write(payload, docObj);
            if(errMsg) return reject({status: 400, errMsg});

            // 查看 前台数据 docObj 正确性 并且 对 is_change is_auto 数据的处理
            await pass_Pnull(false, Model.doc, docObj, payload);

            // is_change is_auto 数据自动处理处;
        }

        // 是否重复 在此添加

        let res = await Model.createMany_Pres(docObjs);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

const setMatch = (payload, match) => {
    if(!payload.rankNum) return "您的 payload 信息错误, 请检查您的 token信息";

    // 如果是公司用户 则只可修改本公司的用户
    if(payload.Firm) {
        match._id = payload.Firm; 
        if(payload.Firm._id) match._id = payload.Firm._id;
    }
}
exports.modifyCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {_id, update} = paramObj;
        if(payload.Firm && payload.Firm._id) _id = payload.Firm._id;

        // 有无权限 完成 这部分字段的修改
        let errMsg = noAuth_write(payload, update);
        if(errMsg) return reject({status: 400, errMsg});

        let match = {_id: _id};
        setMatch(payload, match);

        Org = await Model.detail_Pobj({match});

        let flag_change = false;
        for(key in update) {
            if(Model.doc[key].is_change) continue;
            if(update[key] !== Org[key]) {
                flag_change = true;
            }
        }
        if(!flag_change) return reject({status: 400, errMsg: "您没有修改任何数据"});

        // is_change is_auto 操作前的 数据的验证
        let is_modify_writePre = true;
        await pass_Pnull(is_modify_writePre, Model.doc, update, payload);
        let is_pass = true; // 已经通过了数据验证, 不需要再进行验证

        // is_change is_auto 数据自动处理处;

        // 修改数据
        let res = await Model.modify_Pres(match, update, is_pass);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.modifyManyCT = (payload, paramObj) => new Promise(async(resolve, reject) => {
    try{
        if(payload.Firm) return "您无权批量修改公司, 请联系管理员";

        let {update} = paramObj;
        if(!update) return reject({status: 400, errMsg: "请传递 update 数据"});
        let match = {};
        setMatch(payload, match);
        paramObj.match = match;
        // 不可批量修改的数据
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
        if(payload.Firm) return "您无权删除一个公司, 请联系管理员";

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
        if(payload.Firm) return "您无权删除公司, 请联系管理员";

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










exports.detailCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {_id, select, populate} = paramObj;
        if(payload.Firm && payload.Firm._id) _id = payload.Firm._id;

        // 根据 payload 过滤 match select
        let match = {_id: _id};
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
        if(payload.Firm) return "您无权查看公司列表, 请联系管理员";

        // 根据 payload 过滤 match select
        let {filter = {}} = paramObj;
        let {match = {}} = filter;
        setMatch(payload, match);

        let res = await Model.list_Pres(paramObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});