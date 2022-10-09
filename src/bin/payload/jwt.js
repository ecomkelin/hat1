const jsonwebtoken = require('jsonwebtoken');
const {
	ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EX, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EX
} = global;



/* ============================== 获取token ============================== */
exports.obtain_headersInfo = (headersToken) => {
	if(!headersToken) return null;
	let hts = String(headersToken).split(" ");
	if(hts.length === 1) return null;
	else if(hts.length > 1) return hts[1];
}

/* ================================ 验证 ================================ */
exports.obtainPayload_Pobj = (headersToken, is_refresh)=> new Promise(async(resolve, reject) => {
	try {
		let token = this.obtain_headersInfo(headersToken);
		if(!token) return resolve({});	// 如果没有token 则返回空 payload, 不妨碍无权限的验证
		let token_secret = is_refresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
		jsonwebtoken.verify(token, token_secret, (expired, payload) => {
			if(expired) return reject({status: 401, message: "token错误或过期", expired});
			return resolve(payload);
		})
	} catch(e) {
		return reject(e);
	}
})


/* ================================ 签名 ================================ */
exports.generateToken = (payload, is_refresh=null)=> {
	let token_secret = is_refresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
	let token_ex = is_refresh ? REFRESH_TOKEN_EX : ACCESS_TOKEN_EX;
	return jsonwebtoken.sign(payload, token_secret, {expiresIn: token_ex});
}

exports.generatePayload = (obj)=> {
	let payload = {};
	if(obj._id) payload._id = obj._id;
	if(obj.code) payload.code = obj.code;
	if(obj.nome) payload.nome = obj.nome;
	if(obj.phone) payload.phone = obj.phone;
	if(obj.email) payload.email = obj.email;
	
	if(obj.Firm) payload.Firm = obj.Firm;

	if(obj.type_auth === 'User') {
		payload.type_auth = obj.type_auth;
		payload.rankNum = obj.rankNum;
		payload.is_admin = obj.is_admin;
		payload.auths = [];
		for(let i=0; i<obj.auths.length; i++) {
			let auth = obj.auths[i].toLowerCase();
			if(!payload.auths.includes(auth)) payload.auths.push(auth);
		}
		for(let i=0; i<obj.Roles.length; i++) {
			let Role = obj.Roles[i];
			for(let j=0; j<Role.auths.length; j++) {
				let auth = Role.auths[j].toLowerCase();
				if(!payload.auths.includes(auth)) payload.auths.push(auth);
			}
		}
	}

	return payload;
}