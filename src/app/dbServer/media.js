const k2_media_DB = require("../models/media");

exports.postmedia = (paramObj) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/media postmedia";
        try{
            // to do 写入数据库
            const {code, name, pwd, phoneNum, desp} = paramObj;

            const res_exist = await this.getmedia({matchObj: {code}, projectObj: {_id: 1}})
            if(res_exist.status === 200) return resolve({status: 400, position, message: "已经有此用户名"});

            const object = await k2_media_DB.create({
                code, name, pwd, phonePre, phoneNum, phone, desp
            });
            if(!object) return resolve({status: 400, position, message: "创建media失败"});
            return resolve({status: 200, data: {object}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.getmedia = (paramObj={}) => {
    const position = "@/app/dbServer/media getmedia";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, populate} = paramObj;
            const object = await k2_media_DB.findOne(matchObj, projectObj)
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

exports.getmediaList = (paramObj={}) => {
    const position = "@/app/dbServer/media getmedia";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, skipInt=0, limitInt=50, sortObj={}, populate} = paramObj;
            const objects = await k2_media_DB.find(matchObj, projectObj)
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