const path = require('path');
const {IS_DEV} = global;
const {pass_Pnull} = require(path.resolve(process.cwd(), "bin/js/db/writePre"));
const {pwd_Auto_Pstr, format_phoneInfo} = require("../FN_group");

const Model = require("./Model");
/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
 exports.initCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        if(!IS_DEV) return reject({status: 400, message: "只有 开发状态 才可以使用此功能"});
        // 查看是否已经又了 is_admin
        let Org = await Model.findOne_Pobj({query: {is_admin: true}, projection: {code: 1}});
        if(Org) return reject({status: 400, message: `本系统已经有超级管理员 [${Org.code}], 如果您忘记密码, 请从数据库删除重新添加`});
        if(!docObj.pwd) return reject({status: 400, message: "User init: 请输入超级管理员的密码 "});
        docObj.pwd = await pwd_Auto_Pstr(docObj.pwd);
        docObj.is_admin = true;
        docObj.rankNum = 10;
        // 写入
        let res = await Model.create_Pres(docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});
exports.removeAllCT = () => new Promise(async(resolve, reject) => {
    try{
        if(!IS_DEV) return reject({status: 400, message: "只有 开发状态 才可以使用此功能"});
        /* 删除数据 */
        let dels = await Model.removeMany_Pres({})

        /* 返回 */
        return resolve(dels);
    } catch(e) {
        return reject(e);
    }
});









const noWriteAuth = (payload, docObj) => {
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
                for(; j<payload.auths.length; i++) {
                    if(docObj.auths[i] === payload.auths[j]) break;
                }
                if(j === payload.auths.length) return `payload 权限中 不包含 ${payload.auths[i]} 这个权限, 所以不能给新用户添加此权限`;
            }
        }
        if(docObj.rankNum && docObj.rankNum >= payload.rankNum) return "只可以添加等级比自己低的 rankNum";
    }
}
exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        // 查看 前台数据 docObj 正确性
        if(!docObj.Roles) return reject({status: 400, message: "请传递 用户角色"});
        if(!docObj.auths) docObj.auths = [];
        // 有无权限 完成新数据
        let message = noWriteAuth(payload, docObj);
        if(message) return reject({status: 400, message});

        // is_change is_auto 数据的处理
        delete docObj.is_admin;
        // if(!docObj.pwd) return reject({status: 400, message: "请输入密码"});
        // let passObj = {pwd: docObj.pwd};
        // if(docObj.rankNum) passObj.rankNum = docObj.rankNum;
        // if(docObj.phonePre) passObj.phonePre = docObj.phonePre;
        // if(docObj.phone) passObj.phone = docObj.phone;
        await pass_Pnull(false, Model.doc, docObj, payload);

        // is_change is_auto 数据自动处理处;
        docObj.pwd = await pwd_Auto_Pstr(docObj.pwd);
        format_phoneInfo(docObj);

        // 写入
        let res = await Model.create_Pres(docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs) => new Promise(async(resolve, reject) => {
    try{
        // let Orgs = await Model.list_Pres({query: {}, projection: {code: 1}});
        // 写入
        let res = await Model.createMany_Pres(docObjs);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.modifyCT = (payload, docObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 有无权限 完成新数据
        let message = noWriteAuth(payload, docObj);
        if(message) return reject({status: 400, message});

        let match = {_id: docObj._id};
        // match里面要加入 payload 限制信息
        match.rankNum = {"$lt": payload.rankNum};                           // 把没有权限修改的用户过滤掉
        if(payload.Firm && payload.Firm._id) match.Firm = payload.Firm._id; // 如果是公司用户 则只可修改本公司的用户
        if(payload.Shop && payload.Shop._id) match.Shop = payload.Shop._id; // 如果是分店用户 则只可修改本分店的用户
        // 找到原数据信息
        let Org = await Model.findOne_Pobj({query: match});

        // is_change is_auto 数据的处理
        let passObj = {};
        if(docObj.pwd) passObj.pwd = docObj.pwd;
        if(docObj.rankNum) passObj.rankNum = docObj.rankNum;
        if(docObj.phonePre) passObj.phonePre = docObj.phonePre;
        if(docObj.phone) passObj.phone = docObj.phone;
        await pass_Pnull(true, Model.doc, passObj, payload);
        
        // is_change is_auto 数据自动处理处;
        if(docObj.pwd) docObj.pwd = await pwd_Auto_Pstr(docObj.pwd);
        format_phoneInfo(docObj, Org);
        if(docObj.is_admin === true) docObj.rankNum = 10;
        if(docObj.is_admin === false && Org.rankNum === 10) {
            if(!docObj.rankNum) docObj.rankNum = 1;
        }

        // 修改数据
        let res = await Model.modify_Pres(match, docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, match, update) => new Promise(async(resolve, reject) => {
    try{
        let res = await Model.modifyMany_Pres(match, update);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.removeCT = (payload, body) => new Promise(async(resolve, reject) => {
    try{
        /* 读取数据 */
        let match = {_id: body._id};
        // match 还要加入 payload

        /* 判断数据 */
        let objOrg = await Model.findOne_Pobj({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, message: "数据库中无此数据"});

        /* 删除数据 */
        let del = await Model.remove_Pres(match)
        return resolve(del);
    } catch(e) {
        return reject(e);
    }
});

exports.removeManyCT = (payload, match) => new Promise(async(resolve, reject) => {
    try{
        /* 删除数据 */
        let dels = await Model.removeMany_Pres(match)

        /* 返回 */
        return resolve(dels);
    } catch(e) {
        return reject(e);
    }
});















exports.detailCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {filter={}, select, populate} = paramObj;
        let {match={}} = filter;
        // 根据 payload 过滤 match select
        if(payload.Firm) match.Firm = payload.Firm;
        let res = await Model.detail_Pres(paramObj);
       return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.listCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 根据 payload 过滤 match select
        let res = await Model.list_Pres(paramObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});