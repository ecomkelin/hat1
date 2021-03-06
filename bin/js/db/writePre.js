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

exports.pass_Pnull = (is_modify_writePre, doc, docObj, payload) => new Promise(async(resolve, reject) => {
    try {
        // 如果是从 Control 传递过来的 则为 before 因为 Control有 payload 
        // 否则 is_before 为false 因为 Model 么有 payload
        let is_before = payload ? true : false;
        for(key in docObj) {
            if(is_modify_writePre) {
                if(key === '_id') continue;
                if(doc[key].is_fixed) return reject({status: 400, message: `writePre [${key}]为不可修改数据`});
            }
            await formatDocKey_Pnull(key, doc[key], docObj[key], is_before);
        }
        for(key in doc) {   
            // 下面的三种情况顺序不能变 
            // 1 如果是更新 遇到 is_fixed 直接跳过。也就是说 如果 at_crt 直接跳过 后面自动给数据就不变了
            // 2 自动添加一些数据
            // 3 新加的数据 autoPayload is_autoDate 先被赋值 所以required就没有问题


            // 在更新的情况下 如果不可更改 则跳过： 比如创建时间 后面的代码就不用执行了
            if(is_modify_writePre && doc[key].is_fixed && (docObj[key] !== null && docObj[key] !== undefined)) {
                // delete docObj[key];
                // continue;
                return reject({status: 400, message: `writePre 修改时 不可修改 is_fixed 为true 的字段 [${key}].`})
            }

            // 如果是 Control 给的数据 自动赋值一些payload数据
            if(is_before) {
                if(doc[key].is_auto && docObj[key]) return reject({status: 400, message:`writePre [docObj.${key}]为后端赋值数据 前端不能传输数据`});
                if(doc[key].autoPayload === "_id") {
                    docObj[key] = payload._id;
                } else if(doc[key].autoPayload === "Firm") {
                    if(payload.Firm) docObj[key] = payload.Firm._id || payload.Firm;
                }
            }
            if(doc[key].is_autoDate) docObj[key] = new Date();      // 自动计时


            // 在新创建数据的情况下 判断每个必须的字段 如果前台没有给赋值 则报错
            if(!is_modify_writePre) {
                if(doc[key] instanceof Array) {
                    if(doc[key][0].required_min || doc[key][0].required_max) {
                        if(!docObj[key]) {
                            return reject({status: 400, message:`writePre 创建时 必须添加 [docObj.${key}] Array 字段`});
                        } else if(docObj[key].length < doc[key][0].required_min) {
                            return reject({status: 400, message:`writePre 创建时 [docObj.${key}] Array length不能小于 ${doc[key][0].required_min}`});
                        } else if(docObj[key].length > doc[key][0].required_max) {
                            return reject({status: 400, message:`writePre 创建时 [docObj.${key}] Array length不能大于 ${doc[key][0].required_max}`});
                        }
                    }
                } else {
                    if((doc[key].required === true) && (docObj[key] === null || docObj[key] === undefined)) {
                        return reject({status: 400, message:`writePre 创建时 必须添加 [docObj.${key}] 字段`});
                    }
                }
            }

        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
});