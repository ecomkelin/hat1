const path = require('path');
const format_phonePre = require(path.resolve(process.cwd(), "bin/extra/format/phonePre"));
const Bcrypt = require(path.resolve(process.cwd(), "bin/middle/bcrypt"));

const Model = require("./Model");
const writePre = require(path.resolve(process.cwd(), "src/middle/savePre/writePre"));

/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        let message = writePre.createFilter(Model.doc, docObj);
        if(message) return resolve({status: 400, message});

        // 读取数据
        let {phoneNum} = docObj;

        // 操作数据
        docObj.phonePre = phoneNum ? format_phonePre(docObj.phonePre) : undefined;
        docObj.phone = phoneNum ? docObj.phonePre+phoneNum : undefined;

        if(docObj.pwd) {
            let hash_bcrypt = await Bcrypt.encrypt_prom(docObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            docObj.pwd = hash_bcrypt;
        }

        // 写入
        let object = await Model.create(docObj);
        if(!object) return resolve({status: 400, message: "创建object失败"});

        /* 返回 */
        return resolve({status: 200, data: {object}});
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs) =>  Promise(async(resolve, reject) => {
    try{
        let orgObjs = await Model.find({query: {}, projection: {code: 1}});
        // 写入
        let objects = await Model.createMany(docObjs);

        /* 返回 */
        if(!objects) return resolve({status: 400, message: "创建objects失败"});
        return resolve({status: 200, data: {objects}});
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
            let hash_bcrypt = await Bcrypt.encrypt_prom(updObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            updObj.pwd = hash_bcrypt;
        }

        // 修改数据
        let object = await Model.modify(match, updObj);
        if(!object) return resolve({status: 400, message: "更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "更新成功"});
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    try{
        let updMany = await Model.modifyMany(match, setObj);
        if(!updMany) return resolve({status: 400, message: "批量更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "批量更新成功"});
    } catch(e) {
        return reject(e);
    }
});


exports.removeCT = (payload, body) => new Promise(async(resolve, reject) => {
    try{
        let message = writePre.removeFilter(Model.doc, body._id);
        if(message) return resolve({status: 400, message});

        /* 读取数据 */
        let match = {_id: body._id};
        // match 还要加入 payload

        /* 判断数据 */
        let objOrg = await Model.findOne({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, message: "数据库中无此数据"});

        /* 删除数据 */
        let del = await Model.remove(match)
        if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(e) {
        return reject(e);
    }
});

exports.removeManyCT = (payload, match) => new Promise(async(resolve, reject) => {
    try{
        /* 删除数据 */
        let dels = await Model.removeMany(match)

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(e) {
        return reject(e);
    }
});















exports.detailCT = (payload, paramObj={}, id) => new Promise(async(resolve, reject) => {
    try{
        let {match={}, select, populate} = paramObj;
        // 根据 payload 过滤 match select

        let object = await Model.detail(paramObj, id);

        if(!object) return resolve({status: 400, message: "数据库中无此数据"});
        return resolve({status: 200, message: "查看用户详情成功", data: {object}, paramObj: {
            match,select, populate
        }});
    } catch(e) {
        return reject(e);
    }
});

exports.listCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 根据 payload 过滤 match select
        let res_list = await Model.list(paramObj);
        return resolve(res_list);
        
    } catch(e) {
        return reject(e);
    }
});