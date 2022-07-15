const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const {
	ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EX, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EX
} = require(path.resolve(process.cwd(), "bin/config/env"));



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
		if(!token) return resolve({});
		let token_secret = is_refresh ? REFRESH_TOKEN_SECRET:ACCESS_TOKEN_SECRET;
		jsonwebtoken.verify(token, token_secret, (expired, payload) => {
			if(expired) return reject({status: 401, message: "token错误或过期", expired});
			return resolve(payload);
		})
	} catch(e) {
		return reject(e);
	}
})


/* ================================ 签名 ================================ */
exports.generateToken = (obj, is_refresh=null)=> {
	let payload = this.generatePayload(obj);
	let token_secret = is_refresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
	let token_ex = is_refresh ? REFRESH_TOKEN_EX : ACCESS_TOKEN_EX;
	return jsonwebtoken.sign(payload, token_secret, {expiresIn: token_ex});
}

exports.generatePayload = (obj)=> {
	let payload = {};
	if(obj._id) payload._id = obj._id;
	if(obj.Firm) payload.Firm = obj.Firm;
	if(obj.Shop) payload.Shop = obj.Shop;
	if(obj.code) payload.code = obj.code;
	if(obj.nome) payload.nome = obj.nome;
	if(obj.phone) payload.phone = obj.phone;
	if(obj.email) payload.email = obj.email;
	return payload;
}