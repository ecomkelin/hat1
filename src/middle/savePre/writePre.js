/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 modify/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/
const path = require('path');
const {isObjectId} = require(path.resolve(process.cwd(), "bin/extra/judge/is_ObjectId"));

const regFieldFilter = (doc, obj, key) => {

    if(!doc[key]) {
        return `没有[${key}] 此字段`;
    }
    if(doc[key].is_auto) {
        return `[${key}]为自动生成数据, 不可操作`;
    }

    if(doc[key].trimLen && doc[key].trimLen !== obj[key].length) {
        return `[${key}] 字段的字符串长度必须为 [${doc[key].trimLen}]`;
    }
    if(doc[key].minLen && doc[key].minLen > obj[key].length) {
        return `[${key}] 字段的字符串长度为： [${doc[key].minLen} ~ ${doc[key].maxLen}]`;
    }
    if(doc[key].maxLen &&  doc[key].maxLen < obj[key].length) {
        return `[${key}] 字段的字符串长度为： [${doc[key].minLen} ~ ${doc[key].maxLen}]`;
    }
    if(doc[key].regexp) {
        let regexp = new RegExp(doc[key].regexp);
        if(!regexp.test(obj[key])) {
            return `[${key}] 的规则： [${doc[key].regErrMsg}]`;
        }
    }
}
exports.createFilter = (doc, crtObj) => {
    for(key in crtObj) {
        let message = regFieldFilter(doc, crtObj, key);
        if(message) return message;
    }
    for(key in doc) {
        // 先判断是否可以为空
        if(doc[key].required === true) {
            if(crtObj[key] === null || crtObj[key] === undefined) {
                return `创建时 必须添加 [${key}] 字段`;
            }
        } else {
            if(crtObj[key] === null || crtObj[key] === undefined) continue; // 如果前台没有给数据则可以跳过 不判断后续
        }
    }
}

exports.modifyFilter = (doc, updObj, id) => {
    if(!isObjectId(id)) return 'id 必须为 ObjectId 类型';
    for(key in updObj) {
        let message = regFieldFilter(doc, updObj, key);
        if(message) return message;

        if(doc[key].is_is_fixed) {
            return `[${key}]为不可修改数据`;
        }
    }
}




exports.removeFilter = (doc, id) => {
    if(!isObjectId(id)) return `请传递正确的id信息`;
}