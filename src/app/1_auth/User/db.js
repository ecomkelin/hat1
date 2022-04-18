const path = require('path');
const {LIMIT_FIND} = require(path.join(process.cwd(), "src/config/const_var"));
const format_phonePre = require(path.resolve(process.cwd(), "src/extra/format/phonePre"));
const bcryptMD = require(path.resolve(process.cwd(), "middle/bcrypt"));

const Model = require(path.resolve(process.cwd(), "src/models/1_auth/User/model"));

exports.Model = Model;

exports.create = (payload, createObj) => new Promise(async(resolve, reject) => {
    const position = "User-DS create";
    try{
        // 读取数据
        const {code, phoneNum} = createObj;

        // 操作数据
        createObj.phonePre = phoneNum ? format_phonePre(createObj.phonePre) : undefined;
        createObj.phone = phoneNum ? createObj.phonePre+phoneNum : undefined;
        if(createObj.pwd) {
            const res_pwd = await bcryptMD.encrypt_Prom(createObj.pwd);
            if(res_pwd.status !== 200) return resolve(res_pwd);
            createObj.pwd = res_pwd.data.hash_bcrypt;
        }

        // 判断数据
        const query = {code};
        const objOrg = await Model.findOne({query, projection: {_id: 1}});
        if(objOrg) return resolve({status: 400, position, message: "数据库中已存在此用户"});

        // 写入
        const object = await Model.insertOne(createObj);

        /* 返回 */
        if(!object) return resolve({status: 400, position, message: "创建User失败"});
        return resolve({status: 200, data: {object}});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.insertMany = (payload, insertObjs) =>  Promise(async(resolve, reject) => {
    const position = "User-DS insertMany";
    try{
        // 写入
        const objects = await Model.insertMany(insertObjs);

        /* 返回 */
        if(!objects) return resolve({status: 400, position, message: "创建User失败"});
        return resolve({status: 200, data: {objects}});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.updateOne = (payload, id, setObj) => new Promise(async(resolve, reject) => {
    const position = "User-DS updateOne";
    try{
        // 还要加入 payload
        const match = {_id: id};

        // 判断数据
        const objOrg = await Model.findOne({query: {_id: id}});
        if(!objOrg) return resolve({status: 400, position, message:"数据库中无此数据"});

        // 判断数据
        if(setObj.code && objOrg.code !== setObj.code) {
            const match = {_id: {"$ne": id}, code: setObj.code};
            const objSame = await Model.findOne({query: match, projection: {_id: 1}});
            if(objSame) return resolve({status: 400, position, message: "数据库中有相同的编号"});
        }

        if(setObj.pwd) {
            const res_pwd = await bcryptMD.encrypt_Prom(setObj.pwd);
            if(res_pwd.status !== 200) return resolve(res_pwd);
            setObj.pwd = res_pwd.data.hash_bcrypt;
        }
        // if(setObj.refreshToken) {
        //     const res_refreshToken = await bcryptMD.encrypt_Prom(setObj.refreshToken+ ' re');
        //     if(res_refreshToken.status !== 200) return resolve(res_refreshToken);
        //     setObj.refreshToken = res_refreshToken.data.hash_bcrypt;
        // }

        const object = await Model.updateOne(match, setObj);
        if(!object) return resolve({status: 400, message: "更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "更新成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});


exports.updateMany = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    const position = "User-DS updateMany";
    try{
        const updMany = await Model.updateMany(match, setObj);
        if(!updMany) return resolve({status: 400, message: "批量更新失败"});
        /* 返回 */
        return resolve({status: 200, data: {object}, message: "批量更新成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});


exports.deleteOne = (payload, id) => new Promise(async(resolve, reject) => {
    const position = "User-DS deleteOne";
    try{
        /* 读取数据 */
        const match = {_id: id};
        // match 还要加入 payload

        /* 判断数据 */
        const objOrg = await Model.findOne({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, position, message: "数据库中无此数据"});

        /* 删除数据 */
        const del = await Model.deleteOne(match)
        if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.deleteMany = (payload, match) => new Promise(async(resolve, reject) => {
    const position = "User-DS deleteOne";
    try{
        /* 删除数据 */
        const deleteMany = await Model.deleteMany(match)

        /* 返回 */
        return resolve({status: 200, message: "删除成功"});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});















exports.findOne = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    const position = "User-DS findOne";
    try{
        const {match={}, select, populate} = paramObj;
        // match 还要加入 payload

        const object = await Model.findOne({query: match, projection: select, populate});

        if(!object) return resolve({status: 400, position, message: "数据库中无此数据"});
        return resolve({status: 200, message: "查看用户详情成功", data: {object}, paramObj: {
            match,select, populate
        }});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});

exports.find = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    const position = "User-DS find";
    try{
        // to do 查找数据库
        const {match={}, select, skip=0, limit=LIMIT_FIND, sort={}, populate, search={}} = paramObj;
        if(!sort) sort = {sortNum: -1, at_crt: -1};
        // match 还要加入 payload
        const count = await Model.countDocuments(match);

        const objects = await Model.find({query: match, projection: select, skip, limit, sort, populate});

        let object = null;
        const {fields, keywords} = search;
        if(objects.length > 0 && fields && keywords) {
            match["$or"] = [];
            fields.forEach(field => {
                match["$or"].push({[field]: { $regex: keywords, $options: '$i' }})
            });
            const res_obj = await Model.findOne({query: match, projection: select, populate});
            if(res_obj.status === 200) object = res_obj.data.object;
        }
        return resolve({status: 200, message: "获取用户列表成功", data: {count, objects, object, skip, limit}, paramObj: {
            match,select, skip, limit, sort, populate
        }});
    } catch(err) {
        return reject({status: 500, position, err});
    }
});