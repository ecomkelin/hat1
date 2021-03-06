const bcrypt = require('bcryptjs');

exports.encryptHash_Pstr = (str_bcrypt) => new Promise((resolve, reject) => {
	str_bcrypt=String(str_bcrypt);
	bcrypt.genSalt(parseInt(global.SALT_WORK_FACTOR), function(err, salt) {
		if(err) return reject(err);
		bcrypt.hash(str_bcrypt, salt, function(err, hash_bcrypt) {
			if(err) return reject(err);
			return resolve(hash_bcrypt);
		});
	});
});

exports.matchBcrypt_Pnull = (str_bcrypt, hash_bcrypt) => new Promise(async(resolve, reject) => {
	try {
		if(!str_bcrypt) return reject({status: 400, message: "[密码错误]: 匹配时, 加密字符串不能为空" });
		let isMatch = await bcrypt.compare(str_bcrypt, hash_bcrypt);
		if(!isMatch) return reject({status: 400, message: "[密码错误]: 字符串加密与 hash_bcrypt 不符合" });
		return resolve(null);
	} catch (e) {
		return reject(e);
	}
});