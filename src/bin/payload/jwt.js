const jsonwebtoken = require('jsonwebtoken');


/* ============================== 获取token ============================== */
const obtain_headersInfo = (headersToken) => {
	if(!headersToken) return null;
	let hts = String(headersToken).split(" ");
	if(hts.length === 1) return null;
	else if(hts.length > 1) return hts[1];
}

/* ================================ 验证 ================================ */
exports.obtainPayload_Pobj = (headersToken, is_refresh)=> new Promise(async(resolve, reject) => {
	try {
		let token = obtain_headersInfo(headersToken);
		if(!token) return resolve(null);

		let token_secret = is_refresh ? process.env.REFRESH_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET;

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
	let token_secret = is_refresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
	let token_ex = is_refresh ? process.env.REFRESH_TOKEN_EX : process.env.ACCESS_TOKEN_EX;
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