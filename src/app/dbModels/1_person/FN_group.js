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