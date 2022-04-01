const k2_user_DB = require("../models/user");
const phonePre_standard = require("../../extra/phonePre");

exports.postUser = (paramObj) => {
    return new Promise(async(resolve, reject) => {
        const position = "@/app/dbServer/user postUser";
        try{
            // to do 写入数据库
            const {code, name, pwd, phoneNum, desp} = paramObj;

            const phonePre = phoneNum ? phonePre_standard(paramObj.phonePre) : undefined;
            const phone = phoneNum ? phonePre+phoneNum : undefined;

            const res_exist = await this.getUser({matchObj: {code}, projectObj: {_id: 1}})
            if(res_exist.status === 200) return resolve({status: 400, position, message: "已经有此用户名"});

            const object = await k2_user_DB.create({
                code, name, pwd, phonePre, phoneNum, phone, desp
            });
            if(!object) return resolve({status: 400, position, message: "创建user失败"});
            return resolve({status: 200, data: {object}});
        } catch(err) {
            console.log(position, err);
            return reject({status: 500, position, err});
        }
    });
};

exports.getUser = (paramObj={}) => {
    const position = "@/app/dbServer/user getUser";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, populate} = paramObj;
            const object = await k2_user_DB.findOne(matchObj, projectObj)
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

exports.getUserList = (paramObj={}) => {
    const position = "@/app/dbServer/user getUser";
    return new Promise(async(resolve, reject) => {
        try{
            // to do 查找数据库
            const {matchObj={}, projectObj, skipInt=0, limitInt=50, sortObj={}, populate} = paramObj;
            const objects = await k2_user_DB.find(matchObj, projectObj)
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