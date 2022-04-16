const bcrypt = require('bcryptjs');

exports.encrypt_Prom = (str_bcrypt) => {
	const position = "middle bcrypt encrypt_Prom"
	return new Promise((resolve, reject) => {
		if(!str_bcrypt) resolve({status: 400, message: '请您输入加密字符串'});
		bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR), function(err, salt) {
			if(err) return reject({status: 500, message: 'bcrypt.genSalt error!'});
			bcrypt.hash(str_bcrypt, salt, function(err, hash_bcrypt) {
				if(err) return reject({status: 500, message: 'bcrypt.hash error!'});
				return resolve({status: 200, data: {hash_bcrypt}});
			});
		});
	})
}

exports.matchBcryptProm = (str_bcrypt, hash_bcrypt) => {
	return new Promise(async(resolve) => {
		try {
			if(!str_bcrypt) return resolve({status: 400, message: "匹配时, 加密字符串不能为空" });
			const isMatch = await bcrypt.compare(str_bcrypt, hash_bcrypt);
			if(!isMatch) return resolve({status: 400, message: "字符串加密与 hash_bcrypt 不符合" });
			return resolve({status: 200});
		} catch (error) {
			return resolve({status: 400, message: "[resolve matchBcryptProm]" });
		}
	})
}