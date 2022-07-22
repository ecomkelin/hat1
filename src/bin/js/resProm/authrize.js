const jwtMD = require("../../payload/jwt");
const bcryptMD = require(global.path.resolve(process.cwd(), "src/bin/payload/bcrypt"));
const {format_phonePre} = require(global.path.resolve(process.cwd(), "bin/js/Format"));


/* 用refreshToken刷新 accessToken */
exports.refresh_Pres = (ctx, Model) => new Promise(async(resolve, reject) => {
	try {
		let headersToken = ctx.request.headers['authorization'];

		let payload = await jwtMD.obtainPayload_Pobj(headersToken, true);	// 解码 refreshToken 到 payload
		if(!payload) return reject({status: 400, message: "refresh payload 为空 错误"});
		let object = await Model.findOne_Pobj({match: {_id: payload._id}});	// 因为需要 refreshToken 所以不嫩用 detail_Pobj
		if(!object) return reject({status: 400, message: "授权错误, 请重新登录"});

		let refresh_Token = await jwtMD.obtain_headersInfo(headersToken);		//	前台传递的 refreshToken

		if(refresh_Token !== object.refreshToken) return reject({status: 400, message: "refreshToken 不匹配, 请重新登陆"});

		payload = jwtMD.generatePayload(object);		// 重新生成 payload
		let {accessToken, refreshToken} = await getToken_Pobj(payload, Model);

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

		let {accessToken, refreshToken} = await getToken_Pobj(payload, Model);

		return resolve({
			data: {payload, accessToken, refreshToken},
			message: "登录成功"
		});
    } catch(e) {
        return reject(e);
    }
});

const getToken_Pobj = (payload, Model) => new Promise(async(resolve, reject) => {
	try {
		let accessToken = jwtMD.generateToken(payload);
		let refreshToken = jwtMD.generateToken(payload, true);
		await Model.modify_Pres({_id: payload._id}, {refreshToken, at_login: new Date()});
		return resolve({
			accessToken, refreshToken
		})
	} catch(e) {
		return reject(e);
	}
})


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

			let object = await Model.findOne_Pobj({match, project: {}});	// 因为要用code等其他信息匹配 所以不能用 detail_Pobj
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