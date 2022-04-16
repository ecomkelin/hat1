const path = require('path');
const resJson = require(path.resolve(process.cwd(), "src/resJson"));
const UserDS = require(path.resolve(process.cwd(), "src/models/User/dbServer"));
const jwtMD = require(path.resolve(process.cwd(), "middle/jwt"));
const bcryptMD = require(path.resolve(process.cwd(), "middle/bcrypt"));
const format_phonePre = require(path.resolve(process.cwd(), "src/extra/format/phonePre"));



/* 用refreshToken刷新 accessToken */
exports.refresh = docName => async(ctx, next) => {
	const position = "refresh";
	try {
		const DS = (docName === "b1") ? UserDS : null;	// 判断是哪个数据库在登录

		const res_payload = await jwtMD.token_VerifyProm(ctx.request.headers['authorization']);
		if(res_payload.status !== 200) return resJson.failure(ctx, {...res_payload, position});
		const {token, is_refresh, payload} = res_payload.data;

		if(!is_refresh) return resJson.failure(ctx, {position, message: "refresh header 后面需要加 re"});

		const res_object = await DS.findOne({}, {match: {_id: payload._id}});
		if(!res_object) return resJson.failure(ctx, {position, message: "授权错误, 请重新登录"});
		const object = res_object.data.object;

		// if(token !== object.refreshToken) return resJson.failure(ctx, {position, message: "refreshToken 不匹配"});

		const accessToken = jwtMD.generateToken(payload);
		const refreshToken = jwtMD.generateToken(payload, true);

		await UserDS.updateOne({}, payload._id, {refreshToken, at_login: new Date()});

		return resJson.success(ctx, {
			data: {accessToken, refreshToken, payload},
			position,
			message: "refresh 刷新token成功",
		});
	} catch(err) {
		return resJson.errs(ctx, {position, message: "refresh", err});
	}
}


exports.login = docName => async(ctx, next) => {
    const position = "login";
    try{
		const DS = (docName === "b1") ? UserDS : null;	// 判断是哪个数据库在登录

		const res_object = await obt_object(ctx.request.body, DS);
		if(res_object.status !== 200) return resJson.failure(ctx, res_object);
		const object = res_object.data.object;
		const payload = jwtMD.generatePayload(object);

		const accessToken = jwtMD.generateToken(payload);
		const refreshToken = jwtMD.generateToken(payload, true);

		UserDS.updateOne({}, payload._id, {refreshToken, at_login: new Date()});

		return resJson.success(ctx, {
			data: {payload, accessToken, refreshToken},
			position,
			message: "登录成功"
		})
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

const obt_object = (body, DS) => {
	const position = "obt_object";
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

				const res_object = await DS.findOne({}, {match, select: {}});
				if(res_object.status !== 200) return resolve({status: 400, position, message: "账号错误"});
				const object = res_object.data.object;

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