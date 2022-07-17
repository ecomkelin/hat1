
exports.beforeDockey_Pnull = (key, fieldObj, val) => new Promise((resolve, reject) => {
    try {
        if(!fieldObj) return reject({status: 400, message: `writePre 没有[${key}] 此字段`});

        // if(fieldObj.is_semiAuto) {
        //     return reject({status: 400, message: `writePre [${key}]为自动生成数据, 不可操作`});
        // }

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
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
});

exports.controlPass_Pnull = (doc, docObj) => new Promise(async(resolve, reject) => {
    try {
        for(key in docObj) {
            await this.beforeDockey_Pnull(key, doc[key], docObj[key]);
        }
        return resolve(null);
    } catch(e) {
        return reject(e);
    }
})