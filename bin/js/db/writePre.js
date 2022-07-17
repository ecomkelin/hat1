/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 modify/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/

const {isObjectId} = require("../isType");

const formatDocKey_Pnull = (key, fieldObj, val) => new Promise((resolve, reject) => {
    try {
        if(!fieldObj) return reject({status: 400, message: `writePre 没有[${key}] 此字段`});

        if(fieldObj.is_change) return resolve(null); // 一些变化的数据 不在此判断

        if(fieldObj.trimLen && fieldObj.trimLen !== val.length) {
            if(fieldObj.type !== String) return reject({status: 400, message: `writePre [${key}] 加了 trimLen 限制, 必须为 String 类型`});
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度必须为 [${fieldObj.trimLen}]`});
        }
        if(fieldObj.minLen && fieldObj.minLen > val.length) {
            if(fieldObj.type !== String) return reject({status: 400, message: `writePre [${key}] 加了 minLen 限制, 必须为 String 类型`});
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${fieldObj.minLen} ~ ${fieldObj.maxLen}]`});
        }
        if(fieldObj.maxLen &&  fieldObj.maxLen < val.length) {
            if(fieldObj.type !== String) return reject({status: 400, message: `writePre [${key}] 加了 maxLen 限制, 必须为 String 类型`});
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${fieldObj.minLen} ~ ${fieldObj.maxLen}]`});
        }
        if(fieldObj.regexp) {
            if(fieldObj.type !== String) return reject({status: 400, message: `writePre [${key}] 加了 regexp 限制, 必须为 String 类型`});
            let regexp = new RegExp(fieldObj.regexp);
            if(!regexp.test(val)) {
                return reject({status: 400, message: `writePre [${key}] 的规则： [${fieldObj.regErrMsg}]`});
            }
        }

        if(fieldObj.minNum && fieldObj.minNum > val) {
            if(fieldObj.type !== Number) return reject({status: 400, message: `writePre [${key}] 加了 minNum 限制, 必须为 Number 类型`});
            return reject({status: 400, message: `writePre [${key}] 字段的取值范围为： [${fieldObj.minNum}, ${fieldObj.maxNum}]`});
        }
        if(fieldObj.maxNum &&  fieldObj.maxNum < val) {
            if(fieldObj.type !== Number) return reject({status: 400, message: `writePre [${key}] 加了 maxNum 限制, 必须为 Number 类型`});
            return reject({status: 400, message: `writePre [${key}] 字段的取值范围为： [${fieldObj.minNum}, ${fieldObj.maxNum}]`});
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
});


exports.createPass_Pnull = (doc, crtObj) => new Promise(async(resolve, reject) => {
    try {
        for(key in crtObj) {
            await formatDocKey_Pnull(key, doc[key], crtObj[key]);
        }
        for(key in doc) {
            // 先判断是否可以为空
            if(doc[key].required === true) {
                if(crtObj[key] === null || crtObj[key] === undefined) {
                    return reject({status: 400, message:`writePre 创建时 必须添加 [docObj${key}] 字段`});
                }
            }

            if(doc[key].is_auto) crtObj[key] = new Date();      // 自动计时
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
    
});

exports.modifyPass_Pnull = (doc, updObj, id) => new Promise(async(resolve, reject) => {
    try {
        if(!isObjectId(id)) return reject({status: 400, message: 'id 必须为 ObjectId 类型'});
        for(key in updObj) {
            if(key === '_id') continue;
            if(doc[key].is_fixed) return reject({status: 400, message: `writePre [${key}]为不可修改数据`});
            await formatDocKey_Pnull(key, doc[key], updObj[key]);            
        }
        for(key in doc) {
            if(doc[key].is_fixed) continue; // 如果不可更改 则跳过 比如创建时间
            if(doc[key].is_auto) updObj[key] = new Date();      // 自动计时
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
})
    




exports.removePass_Pnull = (doc, id) => new Promise((resolve, reject) => {
    try {
        if(!isObjectId(id)) return reject({status: 400, message: `writePre 请传递正确的id信息`});
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
})
