const path = require('path');
const jwtMD = require("../../payload/jwt");
const bcryptMD = require(path.resolve(process.cwd(), "src/bin/payload/bcrypt"));
const {format_phonePre} = require(path.resolve(process.cwd(), "bin/js/Format"));


/* 用refreshToken刷新 accessToken */
exports.refresh_Pres = (ctx, Model) => new Promise(async(resolve, reject) => {
	try {
		let headersToken = ctx.request.headers['authorization'];
		let payload = await jwtMD.obtainPayload_Pobj(headersToken, true);
		if(!payload) return reject({status: 400, message: "refresh payload 为空 错误"});
		let object = await Model.findOne_Pobj({query: {_id: payload._id}});
		if(!object) return reject({status: 400, message: "授权错误, 请重新登录"});
		
		let token = await jwtMD.obtain_headersInfo(headersToken);
		if(token !== object.refreshToken) return reject({status: 400, message: "refreshToken 不匹配, 请重新登陆"});

		let {accessToken, refreshToken} = getToken(payload, Model);

		return resolve({
			data: {accessToken, refreshToken, payload},
			message: "refresh 刷新token成功",
		});
	} catch(e) {
		return reject(e);
	}
});


exports.login_Pres = (ctx, Model) => new Promise(async(resolve, reject) => {
    try{
		let object = await obtainObj_Pobj(ctx.request.body, Model);
		let payload = jwtMD.generatePayload(object);

		let {accessToken, refreshToken} = getToken(payload, Model);
		return resolve({
			data: {payload, accessToken, refreshToken},
			message: "登录成功"
		});
    } catch(e) {
        return reject(e);
    }
});

const getToken = (payload, Model) => {
	let accessToken = jwtMD.generateToken(payload);
	let refreshToken = jwtMD.generateToken(payload, true);

	Model.modify_Pres({_id: payload._id}, {refreshToken, at_login: new Date()});
	return {
		accessToken, refreshToken
	}
}

const obtainObj_Pobj = (body, Model) => new Promise(async(resolve, reject) => {
	try {
		let type_login = body.type_login;
		if(type_login === "hat") {
			let hat = body.hat;
			if(!hat) return reject({status: 400, message: "请输入正确的 hat 参数 "});
			let match = {};
			if(hat.code) {
				match.code = hat.code.replace(/^\s*/g,"");
			} else if(hat.email) {
				match.email = hat.email.replace(/^\s*/g,"");
			} else {
				let {phonePre, phoneNum} = hat;
				phonePre = phoneNum ? format_phonePre(phonePre) : undefined;
				match.phone = phoneNum ? phonePre+phoneNum : undefined;
			}

			let object = await Model.findOne_Pobj({query: match, project: {}});
			if(!object) return reject({status: 400, message: "账号错误"});
			await bcryptMD.matchBcrypt_Pnull(hat.pwd, object.pwd);

			return resolve(object);
		} else {
			return reject({status: 400, message: "请输入正确的 [type_login] 类型为String ['hat', 'google', 'facebook', 'weixin'] "});
		}
	} catch(e) {
		return reject(e);
	}
});