/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 modify/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/
const path = require('path');
const {isObjectId} = require(path.resolve(process.cwd(), "bin/js/mongoObjectId"));

const regFieldPath_Pnull = (doc, obj, key) => new Promise((resolve, reject) => {
    try {
        if(!doc[key]) {
            return reject({status: 400, message: `writePre 没有[${key}] 此字段`});
        }

        if(doc[key].is_auto) {
            return reject({status: 400, message: `writePre [${key}]为自动生成数据, 不可操作`});
        }

        if(doc[key].trimLen && doc[key].trimLen !== obj[key].length) {
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度必须为 [${doc[key].trimLen}]`});
        }
        if(doc[key].minLen && doc[key].minLen > obj[key].length) {
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${doc[key].minLen} ~ ${doc[key].maxLen}]`});
        }
        if(doc[key].maxLen &&  doc[key].maxLen < obj[key].length) {
            return reject({status: 400, message: `writePre [${key}] 字段的字符串长度为： [${doc[key].minLen} ~ ${doc[key].maxLen}]`});
        }
        if(doc[key].regexp) {
            let regexp = new RegExp(doc[key].regexp);
            if(!regexp.test(obj[key])) {
                return reject({status: 400, message: `writePre [${key}] 的规则： [${doc[key].regErrMsg}]`});
            }
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
})


exports.createPass_Pnull = (doc, crtObj) => new Promise(async(resolve, reject) => {
    try {
        for(key in crtObj) {
            await regFieldPath_Pnull(doc, crtObj, key);
        }
        for(key in doc) {
            // 先判断是否可以为空
            if(doc[key].required === true) {
                if(crtObj[key] === null || crtObj[key] === undefined) {
                    return reject({status: 400, message:`writePre 创建时 必须添加 [docObj${key}] 字段`});
                }
            } else {
                if(crtObj[key] === null || crtObj[key] === undefined) continue; // 如果前台没有给数据则可以跳过 不判断后续
            }
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
    
})

exports.modifyPass_Pnull = (doc, updObj, id) => new Promise(async(resolve, reject) => {
    try {
        if(!isObjectId(id)) return reject({status: 400, message: 'id 必须为 ObjectId 类型'});
        for(key in updObj) {
            await regFieldPath_Pnull(doc, updObj, key);

            if(doc[key].is_fixed) {
                return reject({status: 400, message: `writePre [${key}]为不可修改数据`});
            }
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
