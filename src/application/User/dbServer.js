
const path = require('path');

const {
    UserDB1,
    // UserDB2
} = require(path.resolve(process.cwd(), "src/models/User"));

const format_phonePre = require("../../extra/format/phonePre");

const exist = (matchObj={}) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/User exist[const]";
        try {
            const exist = await UserDB1.findOne(matchObj, {_id: 1})
            if(!exist) return resolve({status: 400, position, message: "数据库中无此用户信息"});
            return resolve({status: 200, position, message: "数据库中有此用户"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    })
}

exports.create = (payload, obj) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/User create";
        try{
            // 读取数据
            const {code, name, pwd, phoneNum, desp} = obj;

            // 操作数据
            const phonePre = phoneNum ? format_phonePre(obj.phonePre) : undefined;
            console.log(phonePre)
            const phone = phoneNum ? phonePre+phoneNum : undefined;
            let email = 0;
            if(!email) email = undefined;
            // 判断数据
            const matchObj = {code};
            const res_exist = await exist(matchObj)
            res_exist.status = 400;
            res_exist.position = position + " | " +res_exist.position;
            if(res_exist.status === 200) return resolve(res_exist);

            // 写入
            const object = await UserDB1.create({
                code, name, pwd, phonePre, phoneNum, phone, desp
            });

            /* 返回 */
            if(!object) return resolve({status: 400, position, message: "创建User失败"});
            return resolve({status: 200, data: {object}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.update = (payload, id) => {
    const position = "@/app/dbServer/User update";
    return new Promise(async(resolve, reject) => {
        try{
            // 还要加入 payload
            const matchObj = {_id: id};

            // 判断数据
            const res_exist = await exist(matchObj);
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);

            /* 删除数据 */
            const del = await UserDB1.deleteOne(matchObj)
            if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}

exports.deleteOne = (payload, id) => {
    const position = "@/app/dbServer/User deleteOne";
    return new Promise(async(resolve, reject) => {
        try{
            /* 读取数据 */
            const matchObj = {_id: id};
            // matchObj 还要加入 payload

            /* 判断数据 */
            const res_exist = await exist(matchObj);
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);

            /* 删除数据 */
            const del = await UserDB1.deleteOne(matchObj)
            if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}
















exports.findOne = (payload, id, paramObj={}) => {
    const position = "@/app/dbServer/User findOne";
    return new Promise(async(resolve, reject) => {
        try{
            const {matchObj={}, projectObj, populate} = paramObj;
            matchObj._id = id;
            // matchObj 还要加入 payload

            const object = await UserDB1.findOne(matchObj, projectObj)
                .populate(populate);
            // console.log(object)
            if(!object) return resolve({status: 400, position, message: "数据库中无此数据"});
            return resolve({status: 200, message: "查看用户详情成功", data: {object}, paramObj: {
                matchObj,projectObj, populate
            }});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.find = (payload, paramObj={}) => {
    const position = "@/app/dbServer/User find";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, skipInt=0, limitInt=50, sortObj={}, populate} = paramObj;

            // matchObj 还要加入 payload

            const objects = await UserDB1.find(matchObj, projectObj)
                .skip(skipInt).limit(limitInt)
                .sort(sortObj)
                .populate(populate);
            if(!objects) return resolve({status: 400, position, message: "数据库中无此数据"});
            return resolve({status: 200, message: "获取用户列表成功", data: {objects}, paramObj: {
                matchObj,projectObj, skipInt, limitInt, sortObj, populate
            }});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};