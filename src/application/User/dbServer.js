
const path = require('path');

const Model = require(path.resolve(process.cwd(), "src/models/User"));

const format_phonePre = require("../../extra/format/phonePre");

const exist = (match={}, select={}) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer exist[const]";
        try {
            const object = await Model.model1.findOne(match, select)
            if(!object) return resolve({status: 400, position, message: "数据库中无此用户信息"});
            return resolve({status: 200, data: {object}, position, message: "数据库中有此用户"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    })
}

exports.create = (payload, body) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer create";
        try{
            // 读取数据
            const {code, phoneNum} = body;

            // 操作数据
            body.phonePre = phoneNum ? format_phonePre(body.phonePre) : undefined;
            body.phone = phoneNum ? body.phonePre+phoneNum : undefined;

            // 判断数据
            const matchSame = {code};
            const res_same = await exist(matchSame, {_id: 1});
            if(res_same.status === 200) {
                res_same.status = 400;
                res_same.position = position + " | " +res_same.position;
                return resolve(res_same);
            }

            // 写入
            const object = await Model.model1.create(body);

            /* 返回 */
            if(!object) return resolve({status: 400, position, message: "创建User失败"});
            return resolve({status: 200, data: {object}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};
exports.insertMany = (payload, bodys) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer insertMany";
        try{
            // 写入
            const objects = await Model.model1.insertMany(bodys);

            /* 返回 */
            if(!objects) return resolve({status: 400, position, message: "创建User失败"});
            return resolve({status: 200, data: {objects}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};
exports.update = (payload, id, body) => {
    const position = "@/app/dbServer update";
    return new Promise(async(resolve, reject) => {
        try{
            // 还要加入 payload
            const match = {_id: id};

            // 判断数据
            const res_exist = await exist(match);
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);
            const objOrg = res_exist.data.object;

            // 判断数据
            if(objOrg.code !== body.code) {
                const matchSame = {_id: {"$ne": id}, code: body.code};
                const res_same = await exist(matchSame, {_id: 1});
                if(res_same.status === 200) {
                    res_same.status = 400;
                    res_same.position = position + " | " +res_same.position;
                    return resolve(res_same);
                }
            }

            const object = await Model.model1.update(match, {$set: body});
            if(!object) return resolve({status: 400, message: "更新失败"});
            /* 返回 */
            return resolve({status: 200, data: {object}, message: "更新成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}

exports.updateMany = (payload, match, setObj) => {
    const position = "@/app/dbServer updateMany";
    return new Promise(async(resolve, reject) => {
        try{
            const updMany = await Model.model1.updateMany(match, setObj);
            if(!updMany) return resolve({status: 400, message: "批量更新失败"});
            /* 返回 */
            return resolve({status: 200, data: {object}, message: "批量更新成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}

exports.deleteOne = (payload, id) => {
    const position = "@/app/dbServer deleteOne";
    return new Promise(async(resolve, reject) => {
        try{
            /* 读取数据 */
            const match = {_id: id};
            // match 还要加入 payload

            /* 判断数据 */
            const res_exist = await exist(match, {_id: 1});
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);

            /* 删除数据 */
            const del = await Model.model1.deleteOne(match)
            if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}
exports.deleteMany = (payload, match) => {
    const position = "@/app/dbServer deleteOne";
    return new Promise(async(resolve, reject) => {
        try{
            /* 删除数据 */
            const deleteMany = await Model.model1.deleteMany(match)

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}















exports.findOne = (payload, id, paramObj={}) => {
    const position = "@/app/dbServer findOne";
    return new Promise(async(resolve, reject) => {
        try{
            const {match={}, select, populate} = paramObj;
            match._id = id;
            // match 还要加入 payload

            const object = await Model.model1.findOne(match, select)
                .populate(populate);
            // console.log(object)
            if(!object) return resolve({status: 400, position, message: "数据库中无此数据"});
            return resolve({status: 200, message: "查看用户详情成功", data: {object}, paramObj: {
                match,select, populate
            }});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.find = (payload, paramObj={}) => {
    const position = "@/app/dbServer find";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {match={}, select, skip=0, limit=50, sort={}, populate} = paramObj;
            console.log(match)
            // match 还要加入 payload
            const objects = await Model.model1.find(match, select)
                .skip(skip).limit(limit)
                .sort(sort)
                .populate(populate);
            if(!objects) return resolve({status: 400, position, message: "数据库中无此数据"});
            return resolve({status: 200, message: "获取用户列表成功", data: {objects}, paramObj: {
                match,select, skip, limit, sort, populate
            }});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};