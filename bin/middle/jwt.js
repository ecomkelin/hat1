const jsonwebtoken = require('jsonwebtoken');

/* ============================== 获取token ============================== */
exports.obtain_headersInfo = (headersToken) => {
	if(!headersToken) return {codePlat: null, token: null, is_refresh: null};
	let hts = String(headersToken).split(" ");
	if(hts.length === 1) return {codePlat: hts[0], token: null, is_refresh: null};
	else if(hts.length === 2) return {codePlat: hts[0], token: hts[1], is_refresh: null};
	else {
		if(hts[2] == 're') return {codePlat: hts[0], token: hts[1], is_refresh: hts[2]};
		return {codePlat: hts[0], token: hts[1], is_refresh: null};
	}
}

/* ================================ 验证 ================================ */
exports.tokenVerify_Prom = (headersToken)=> new Promise(async(resolve, reject) => {
	try {
		let {token, is_refresh} = this.obtain_headersInfo(headersToken);

		if(!token) return  resolve({status: 400, message: "请您传递 headers 空格后第第二个token信息"});
		let token_secret = is_refresh ? process.env.REFRESH_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET;

		jsonwebtoken.verify(token, token_secret, (expired, payload) => {
			if(expired) return resolve({status: 401, message: "token错误或过期", expired});
			return resolve({status: 200, data: {token, is_refresh, payload}});
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