const path = require('path');
const { Model } = require('./User/db');
const resJson = require(path.resolve(process.cwd(), "src/resJson"));
const jwtMD = require(path.resolve(process.cwd(), "middle/jwt"));
const bcryptMD = require(path.resolve(process.cwd(), "middle/bcrypt"));
const format_phonePre = require(path.resolve(process.cwd(), "src/extra/format/phonePre"));



/* 用refreshToken刷新 accessToken */
exports.refresh = Model => async(ctx, next) => {
	const position = "refresh";
	try {

		const res_payload = await jwtMD.token_VerifyProm(ctx.request.headers['authorization']);
		if(res_payload.status !== 200) return resJson.failure(ctx, {...res_payload, position});
		const {token, is_refresh, payload} = res_payload.data;

		if(!is_refresh) return resJson.failure(ctx, {position, message: "refresh header 后面需要加 re"});

		const object = await Model.findOne({query: {_id: payload._id}});
		if(!object) return resJson.failure(ctx, {position, message: "授权错误, 请重新登录"});

		// if(token !== object.refreshToken) return resJson.failure(ctx, {position, message: "refreshToken 不匹配"});

		const {accessToken, refreshToken} = getToken(payload, Model);

		return resJson.success(ctx, {
			data: {accessToken, refreshToken, payload},
			position,
			message: "refresh 刷新token成功",
		});
	} catch(err) {
		return resJson.errs(ctx, {position, message: "refresh", err});
	}
}


exports.login = Model => async(ctx, next) => {
    const position = "login";
    try{
		const res_object = await objectObt_Prom(ctx.request.body, Model);
		if(res_object.status !== 200) return resJson.failure(ctx, res_object);
		const object = res_object.data.object;
		const payload = jwtMD.generatePayload(object);

		const {accessToken, refreshToken} = getToken(payload, Model);

		return resJson.success(ctx, {
			data: {payload, accessToken, refreshToken},
			position,
			message: "登录成功"
		})
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};
const getToken = (payload, Model) => {
	const accessToken = jwtMD.generateToken(payload);
	const refreshToken = jwtMD.generateToken(payload, true);

	Model.updateOne({_id: payload._id}, {refreshToken, at_login: new Date()});
	return {
		accessToken, refreshToken
	}
}
const objectObt_Prom = (body, Model) => {
	const position = "objectObt_Prom";
	return new Promise(async(resolve, reject) => {
		try {
			const type_login = body.type_login;
			if(type_login === "hat") {
				const hat = body.hat;
				if(!hat) return resolve({status: 400, position, message: "请输入正确的 hat 参数 "});
				const match = {};
				if(hat.code) {
					match.code = hat.code.replace(/^\s*/g,"");
				} else if(hat.email) {
					match.email = hat.email.replace(/^\s*/g,"");
				} else {
					let {phonePre, phoneNum} = hat;
					phonePre = phoneNum ? format_phonePre(phonePre) : undefined;
					match.phone = phoneNum ? phonePre+phoneNum : undefined;
				}

				const object = await Model.findOne({query: match, project: {}});
				if(!object) return resolve({status: 400, position, message: "账号错误"});

				const res_pwd_match = await bcryptMD.matchBcryptProm(hat.pwd, object.pwd);
				if(res_pwd_match.status != 200) return resolve({status: 400, position, message: "密码错误"});

				return resolve({status: 200, data: {object}});
			} else {
				return resolve({status: 400, position, message: "请输入正确的 [type_login] 类型为String ['hat', 'google', 'facebook', 'weixin'] "});
			}
		} catch(err) {
			return reject({status: 500, position, err});
		}
	})
}