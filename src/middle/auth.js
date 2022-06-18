const path = require('path');
const jwtMD = require(path.resolve(process.cwd(), "bin/middle/jwt"));
const bcryptMD = require(path.resolve(process.cwd(), "bin/middle/bcrypt"));
const format_phonePre = require(path.resolve(process.cwd(), "bin/extra/format/phonePre"));


/* 用refreshToken刷新 accessToken */
exports.refresh_Pres = (ctx, Model) => new Promise(async(resolve, reject) => {
	try {
		let res_payload = await jwtMD.tokenVerify_Pdata(ctx.request.headers['authorization']);
		let {token, is_refresh, payload} = res_payload;

		if(!is_refresh) return reject({status: 400, message: "refresh header 后面需要加 re"});

		let object = await Model.findOne_Pobj({query: {_id: payload._id}});
		if(!object) return reject({status: 400, message: "授权错误, 请重新登录"});

		// if(token !== object.refreshToken) return reject({status: 400, message: "refreshToken 不匹配"});

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
		let res_object = await obtainObj_Pobj(ctx.request.body, Model);
		if(res_object.status !== 200) return resolve(res_object);
		let object = res_object.data.object;
		let payload = jwtMD.generatePayload(object);

		let {accessToken, refreshToken} = getToken(payload, Model);

		return resolve({
			status: 400,
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

			return resolve({data: {object}});
		} else {
			return reject({status: 400, message: "请输入正确的 [type_login] 类型为String ['hat', 'google', 'facebook', 'weixin'] "});
		}
	} catch(e) {
		return reject(e);
	}
});