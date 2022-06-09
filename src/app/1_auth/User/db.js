const path = require('path');
const format_phonePre = require(path.resolve(process.cwd(), "bin/extra/format/phonePre"));
const bcryptMD = require(path.resolve(process.cwd(), "bin/middle/bcrypt"));
const Model = require(path.resolve(process.cwd(), "src/models/1_auth/User"));

exports.doc = Model.doc;
exports.Model = Model;

exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        // 读取数据
        let {phoneNum} = docObj;

        // 操作数据
        docObj.phonePre = phoneNum ? format_phonePre(docObj.phonePre) : undefined;
        docObj.phone = phoneNum ? docObj.phonePre+phoneNum : undefined;

        if(docObj.pwd) {
            let hash_bcrypt = await bcryptMD.encrypt_prom(docObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            docObj.pwd = hash_bcrypt;
        }

        // 写入
        let object = await Model.create(docObj);
        if(!object) return resolve({status: 400, message: "创建object失败"});

        /* 返回 */
        return resolve({status: 200, data: {object}});
    } catch(err) {
        return reject({status: 500, err});
    }
});

exports.createMany = (payload, docObjs) =>  Promise(async(resolve, reject) => {
    try{
        let orgObjs = await Model.find({query: {}, projection: {code: 1}});
        // 写入
        let objects = await Model.insertMany(docObjs);

        /* 返回 */
        if(!objects) return resolve({status: 400, message: "创建objects失败"});
        return resolve({status: 200, data: {objects}});
    } catch(err) {
        return reject({status: 500, err});
    }
});

exports.modifyCT = (payload, id, updObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 还要加入 payload
        let match = {_id: id};

        // 操作数据
        if(updObj.pwd) {
            let hash_bcrypt = await bcryptMD.encrypt_prom(updObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, message: "密码加密失败"});
            updObj.pwd = hash_bcrypt;
        }

        // 修改数据
        let object = await Model.modify(match, updObj);
        if(!object) return resolve({status: 400, message: "更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "更新成功"});
    } catch(err) {
        return reject({status: 500, err});
    }
});


exports.modifyMany = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    try{
        let updMany = await Model.updateMany(match, setObj);
        if(!updMany) return resolve({status: 400, message: "批量更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "批量更新成功"});
    } catch(err) {
        return reject({status: 500, err});
    }
});


exports.removeCT = (payload, id) => new Promise(async(resolve, reject) => {
    try{
        /* 读取数据 */
        let match = {_id: id};
        // match 还要加入 payload

        /* 判断数据 */
        let objOrg = await Model.findOne({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, message: "数据库中无此数据"});

        /* 删除数据 */
        let del = await Model.remove(match)
        if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, err});
    }
});

exports.removeMany = (payload, match) => new Promise(async(resolve, reject) => {
    try{
        /* 删除数据 */
        let dels = await Model.deleteMany(match)

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, err});
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
    } catch(err) {
        return reject({status: 500, err});
    }
});

exports.listCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 根据 payload 过滤 match select

        let res_list = await Model.list(paramObj);
        return resolve(res_list);
        
    } catch(err) {
        return reject({status: 500, err});
    }
});