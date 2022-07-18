/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 modify/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/

const {isObjectId} = require("../isType");

const formatDocKey_Pnull = (key, fieldObj, val, is_before) => new Promise((resolve, reject) => {
    try {
        if(!fieldObj) return reject({status: 400, message: `writePre 没有[${key}] 此字段`});

        if(!is_before && fieldObj.is_change) return resolve(null); // 一些变化的数据 不在变化后判断 直接返回空通过

        if(val && fieldObj.type === String) {
            if(fieldObj.trimLen && fieldObj.trimLen !== val.length) return reject({status: 400, message: `writePre [${key}] 字段的字符串长度必须为 [${fieldObj.trimLen}]`});
            if(fieldObj.minLen && fieldObj.minLen > val.length) return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${fieldObj.minLen} ~ ${fieldObj.maxLen}]`});
            if(fieldObj.maxLen &&  fieldObj.maxLen < val.length)return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${fieldObj.minLen} ~ ${fieldObj.maxLen}]`});
            if(fieldObj.regexp) {
                let regexp = new RegExp(fieldObj.regexp);
                if(!regexp.test(val)) {
                    return reject({status: 400, message: `writePre [${key}] 的规则： [${fieldObj.regErrMsg}]`});
                }
            }
        }

        if(fieldObj.type === Number && !isNaN(parseInt(val))) {
            val = parseInt(val);
            if(fieldObj.minNum && fieldObj.minNum > val) return reject({status: 400, message: `writePre [${key}] 字段的取值范围为： [${fieldObj.minNum}, ${fieldObj.maxNum}]`});
            if(fieldObj.maxNum &&  fieldObj.maxNum < val) return reject({status: 400, message: `writePre [${key}] 字段的取值范围为： [${fieldObj.minNum}, ${fieldObj.maxNum}]`});
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
});

exports.pass_Pnull = (is_upd, doc, docObj, payload) => new Promise(async(resolve, reject) => {
    try {
        let is_before = payload ? true : false;
        for(key in docObj) {
            if(is_upd) {
                if(key === '_id') continue;
                if(doc[key].is_fixed) return reject({status: 400, message: `writePre [${key}]为不可修改数据`});
            }
            await formatDocKey_Pnull(key, doc[key], docObj[key], is_before);
        }
        for(key in doc) {
            if(!is_upd) {
                // 先判断是否可以为空
                if(doc[key].required === true) {
                    if(docObj[key] === null || docObj[key] === undefined) {
                        return reject({status: 400, message:`writePre 创建时 必须添加 [docObj${key}] 字段`});
                    }
                }
            } else {
                if(doc[key].is_fixed) continue; // 如果不可更改 则跳过 比如创建时间
            }
            if(is_before) {
                if(doc[key].is_semiAuto && docObj[key]) return reject({status: 400, message:`writePre [docObj${key}] 不能前端传输数据`});
                if(doc[key].is_autoPayload) docObj[key] = payload._id;
            }

            if(doc[key].is_autoDate) docObj[key] = new Date();      // 自动计时
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
})

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

            if(doc[key].is_autoDate) crtObj[key] = new Date();      // 自动计时
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
    
});

exports.modifyPass_Pnull = (doc, updObj) => new Promise(async(resolve, reject) => {
    try {
        for(key in updObj) {
            if(key === '_id') continue;
            if(doc[key].is_fixed) return reject({status: 400, message: `writePre [${key}]为不可修改数据`});
            await formatDocKey_Pnull(key, doc[key], updObj[key]);            
        }
        for(key in doc) {
            if(doc[key].is_fixed) continue; // 如果不可更改 则跳过 比如创建时间
            if(doc[key].is_autoDate) updObj[key] = new Date();      // 自动计时
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
