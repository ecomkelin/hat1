const {
    MediaSchema,
    MediaDB1,
    // MediaDB2
} = require("../models/Media");
const {isObjectId} = require("../../extra/judge/is_ObjectId");
const format_phonePre = require("../../extra/format/phonePre");
console.log(Object.keys(MediaSchema));
const existMedia = (matchObj={}) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/Media existMedia[const]";
        try {
            const exist = await MediaDB1.findOne(matchObj, {_id: 1})
            if(!exist) return resolve({status: 400, position, message: "数据库中无此用户信息"});
            return resolve({status: 200, position, message: "数据库中有此用户"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    })
}

exports.Media_create = (payload, obj) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/Media Media_create";
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
            const res_exist = await existMedia(matchObj)
            res_exist.status = 400;
            res_exist.position = position + " | " +res_exist.position;
            if(res_exist.status === 200) return resolve(res_exist);

            // 写入
            const object = await MediaDB1.create({
                code, name, pwd, phonePre, phoneNum, phone, desp
            });

            /* 返回 */
            if(!object) return resolve({status: 400, position, message: "创建Media失败"});
            return resolve({status: 200, data: {object}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.Media_put = (payload, id) => {
    const position = "@/app/dbServer/Media Media_put";
    return new Promise(async(resolve, reject) => {
        try{
            if(!isObjectId(id)) return resolve({status: 400, position, message: "请传递 正确的 params [id] 参数", paramObj: {id}});
            // 还要加入 payload
            const matchObj = {_id: id};

            // 判断数据
            const res_exist = await existMedia(matchObj);
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);

            /* 删除数据 */
            const del = await MediaDB1.deleteOne(matchObj)
            if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}

exports.Media_delete = (payload, id) => {
    const position = "@/app/dbServer/Media Media_delete";
    return new Promise(async(resolve, reject) => {
        try{
            /* 读取数据 */
            if(!isObjectId(id)) return resolve({status: 400, position, message: "请传递 正确的 params [id] 参数", paramObj: {id}});
            const matchObj = {_id: id};
            // matchObj 还要加入 payload

            /* 判断数据 */
            const res_exist = await existMedia(matchObj);
            res_exist.position = position + " | " + res_exist.position;
            if(res_exist.status === 400) return resolve(res_exist);

            /* 删除数据 */
            const del = await MediaDB1.deleteOne(matchObj)
            if(del.deletedCount === 0) return resolve({status: 400, message: "删除失败"});

            /* 返回 */
            return resolve({status: 200, message: "删除成功"});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
}
















exports.Media_get = (payload, id, paramObj={}) => {
    const position = "@/app/dbServer/Media Media_get";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            if(!isObjectId(id)) return resolve({status: 400, position, message: "请传递 正确的 params [id] 参数", paramObj: {id}});

            const {matchObj={}, projectObj, populate} = paramObj;
            matchObj._id = id;
            // matchObj 还要加入 payload

            const object = await MediaDB1.findOne(matchObj, projectObj)
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

exports.Media_getMany = (payload, paramObj={}) => {
    const position = "@/app/dbServer/Media Media_getMany";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, skipInt=0, limitInt=50, sortObj={}, populate} = paramObj;

            // matchObj 还要加入 payload

            const objects = await MediaDB1.find(matchObj, projectObj)
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