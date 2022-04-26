const path = require('path');
const {LIMIT_FIND} = require(path.join(process.cwd(), "bin/_sysConf"));
const format_phonePre = require(path.resolve(process.cwd(), "src/extra/format/phonePre"));
const bcryptMD = require(path.resolve(process.cwd(), "middle/bcrypt"));
const UniqParam = require(path.resolve(process.cwd(), "middle/docUniqParam"));
const Model = require(path.resolve(process.cwd(), "src/models/1_auth/User"));

exports.doc = Model.doc;
exports.Model = Model;

exports.create = (payload, docObj) => new Promise(async(resolve, reject) => {
    let position = "User-DS create";
    try{
        // 读取数据
        let {code, phoneNum} = docObj;

        // 操作数据
        docObj.phonePre = phoneNum ? format_phonePre(docObj.phonePre) : undefined;
        docObj.phone = phoneNum ? docObj.phonePre+phoneNum : undefined;

        if(docObj.pwd) {
            let hash_bcrypt = await bcryptMD.encrypt_prom(docObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, position, message: "密码加密失败"});
            docObj.pwd = hash_bcrypt;
        }

        // 写入 auto 数据
        docObj.at_crt = docObj.at_upd = new Date();
        // docObj.crt_User = docObj.upd_User = payload;
        // docObj.Firm = payload.Firm;

        // 判断数据
        let [flag, query] = UniqParam(Model.doc, docObj);
        if(!flag) return resolve({status: 400, position, message: query});
        let objSame = await Model.findOne({query, projection: {_id: 1}});
        if(objSame) return resolve({status: 400, position, message: "数据库中已存在此用户"});

        // 写入
        let object = await Model.insertOne(docObj);
        if(!object) return resolve({status: 400, position, message: "创建object失败"});

        /* 返回 */
        return resolve({status: 200, data: {object}});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.createMany = (payload, docObjs) =>  Promise(async(resolve, reject) => {
    let position = "User-DS createMany";
    try{
        let orgObjs = await Model.find({query: {}, projection: {code: 1}});
        // 写入
        let objects = await Model.insertMany(docObjs);

        /* 返回 */
        if(!objects) return resolve({status: 400, position, message: "创建objects失败"});
        return resolve({status: 200, data: {objects}});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.modify = (payload, id, setObj={}) => new Promise(async(resolve, reject) => {
    let position = "User-DS modify";
    try{
        // 还要加入 payload
        let match = {_id: id};

        // 判断数据
        let objOrg = await Model.findOne({query: match});
        if(!objOrg) return resolve({status: 400, position, message:"数据库中无此数据"});

        // 操作数据
        if(setObj.pwd) {
            let hash_bcrypt = await bcryptMD.encrypt_prom(setObj.pwd);
            if(!hash_bcrypt) return resolve({status: 400, position, message: "密码加密失败"});
            setObj.pwd = hash_bcrypt;
        }

        if(objOrg.code === setObj.code) {
            delete setObj.code;
        }

        // 判断数据
        let [flag, query] = UniqParam(Model.doc, setObj);
        if(!flag) return resolve({status: 400, position, message: query});
        let objSame = await Model.findOne({query, projection: {_id: 1}});
        if(objSame) return resolve({status: 400, position, message: "数据库中已存在此用户"});

        // 修改数据
        let object = await Model.updateOne(match, setObj);
        if(!object) return resolve({status: 400, message: "更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "更新成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});


exports.modifyMany = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    let position = "User-DS modifyMany";
    try{
        let updMany = await Model.updateMany(match, setObj);
        if(!updMany) return resolve({status: 400, message: "批量更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "批量更新成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});


exports.remove = (payload, id) => new Promise(async(resolve, reject) => {
    let position = "User-DS remove";
    try{
        /* 读取数据 */
        let match = {_id: id};
        // match 还要加入 payload

        /* 判断数据 */
        let objOrg = await Model.findOne({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, position, message: "数据库中无此数据"});

        /* 删除数据 */
        let del = await Model.deleteOne(match)
        if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.removeMany = (payload, match) => new Promise(async(resolve, reject) => {
    let position = "User-DS removeMany";
    try{
        /* 删除数据 */
        let dels = await Model.deleteMany(match)

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});















exports.detail = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    let position = "User-DS detail";
    try{
        let {match={}, select, populate} = paramObj;
        // match 还要加入 payload

        let object = await Model.findOne({query: match, projection: select, populate});

        if(!object) return resolve({status: 400, position, message: "数据库中无此数据"});
        return resolve({status: 200, message: "查看用户详情成功", data: {object}, paramObj: {
            match,select, populate
        }});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.list = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    let position = "User-DS list";
    try{
        // to do 查找数据库
        let {match={}, select, skip=0, limit=LIMIT_FIND, sort={}, populate, search={}} = paramObj;
        if(!sort) sort = {sortNum: -1, at_crt: -1};
        // match 还要加入 payload
        let count = await Model.countDocuments(match);

        let objects = await Model.find({query: match, projection: select, skip, limit, sort, populate});

        let object = null;
        let {fields, keywords} = search;
        if(objects.length > 0 && fields && keywords) {
            match["$or"] = [];
            fields.forEach(field => {
                match["$or"].push({[field]: { $regex: keywords, $options: '$i' }})
            });
            let res_obj = await Model.findOne({query: match, projection: select, populate});
            if(res_obj.status === 200) object = res_obj.data.object;
        }
        return resolve({status: 200, message: "获取用户列表成功", data: {count, objects, object, skip, limit}, paramObj: {
            match,select, skip, limit, sort, populate
        }});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});