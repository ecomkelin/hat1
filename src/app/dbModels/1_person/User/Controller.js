const path = require('path');
const {format_phonePre} = require(path.resolve(process.cwd(), "bin/js/Format"));
const Bcrypt = require(path.resolve(process.cwd(), "src/bin/payload/bcrypt"));

const Model = require("./Model");
const writePre = require(path.resolve(process.cwd(), "src/bin/permission/writePre"));

/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        // 整体权限
        // 部分权限
        await writePre.createPass_Pnull(Model.doc, docObj);

        // 读取数据
        let {phoneNum} = docObj;

        // 操作数据
        docObj.phonePre = phoneNum ? format_phonePre(docObj.phonePre) : undefined;
        docObj.phone = phoneNum ? docObj.phonePre+phoneNum : undefined;

        if(docObj.pwd) {
            let hash_bcrypt = await Bcrypt.encryptHash_Pstr(docObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            docObj.pwd = hash_bcrypt;
        }

        // 写入
        let res = await Model.create_Pres(docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs) =>  Promise(async(resolve, reject) => {
    try{
        let orgObjs = await Model.list_Pres({query: {}, projection: {code: 1}});
        // 写入
        let res = await Model.createMany_Pres(docObjs);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.modifyCT = (payload, updObj={}) => new Promise(async(resolve, reject) => {
    try{
        let match = {_id: updObj._id};
        // 还要加入 payload

        // 操作数据
        if(updObj.pwd) {
            let hash_bcrypt = await Bcrypt.encryptHash_Pstr(updObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            updObj.pwd = hash_bcrypt;
        }

        // 修改数据
        let res = await Model.modify_Pres(match, updObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    try{
        let res = await Model.modifyMany_Pres(match, setObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.removeCT = (payload, body) => new Promise(async(resolve, reject) => {
    try{
        await writePre.removePass_Pnull(Model.doc, body._id);

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
        return resolve({message: "删除成功"});
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