const path = require('path');

const Bcrypt = require(path.resolve(process.cwd(), "src/bin/payload/bcrypt"));

exports.pwd_Auto_Pstr = (str) => new Promise(async(resolve, reject) => {
    try {
        let hash_bcrypt = await Bcrypt.encryptHash_Pstr(str);
        if(!hash_bcrypt) return reject({status: 400, message: "密码加密失败"});
        return resolve(hash_bcrypt);
    } catch(e) {
        return reject(e);
    }
})

const {format_phonePre} = require(path.resolve(process.cwd(), "bin/js/Format"));

const new_phoneInfo = (docObj) => {
    if(docObj.phoneNum) {
        docObj.phonePre = format_phonePre(docObj.phonePre);
        docObj.phone = docObj.phonePre+docObj.phoneNum;
    }
}
exports.format_phoneInfo = (docObj, obj={}) => {
    if(obj && obj.phone) {
        if(docObj.phonePre && docObj.phonePre !== obj.phonePre) {
            docObj.phonePre = format_phonePre(docObj.phonePre);
        } else {
            docObj.phonePre = obj.phonePre;
        }
        if(!docObj.phoneNum) {
            docObj.phoneNum = obj.phoneNum;
        }
        docObj.phone = docObj.phonePre+docObj.phoneNum;
    } else {
        new_phoneInfo(docObj);
    }
}
