const jwtMD = require(path.join(process.cwd(), "core/encryption/jwt"));
const bcryptMD = require(path.resolve(process.cwd(), "core/encryption/bcrypt"));
const {format_phonePre} = require(path.resolve(process.cwd(), "core/method/Format"));


/* 用refreshToken刷新 accessToken */
/**
 * refreshToken 共用
 * @param {Object} ctx 
 * @param {Object} Model 
 */
exports.refresh = (Model) => async(ctx, next) => {
	try {
		let headersToken = ctx.request.headers['authorization'];

        let payload = await jwtMD.obtainPayload_Pobj(headersToken, true);	// 解码 refreshToken 到 payload
        
		if(!payload) return resERR(ctx, "refresh payload 为空 错误", next);
		let object = await Model.findOne_Pobj({match: {_id: payload._id}});	// 因为需要 refreshToken 所以不嫩用 detail_Pobj
		if(!object) return resERR(ctx, "授权错误, 请重新登录", next);

		let refresh_Token = await jwtMD.obtToken_fromHeaders(headersToken);		//	前台传递的 refreshToken

		if(refresh_Token !== object.refreshToken) return resERR(ctx, {errMsg: "refreshToken 不匹配, 请重新登陆"}, next);

		payload = jwtMD.generatePayload(object);		// 重新生成 payload
		let {accessToken, refreshToken} = generateTokens(payload, Model);

		return resSUCCESS( ctx,
            {
                data: {accessToken, refreshToken, payload},
                message: "refresh 刷新token成功",
            },
            next
        );
	} catch(e) {
		return resERR(ctx, e, next);
	}
};

/**
 * login 登录 共用
 * @param {Object} ctx 
 * @param {Object} Model 
 */
exports.login = (Model) => async(ctx, next) => {
    try{
		let object = await obtLoginObj_Pobj(ctx.request.body, Model);

		let payload = jwtMD.generatePayload(object);

		let {accessToken, refreshToken} = generateTokens(payload, Model);

		return resSUCCESS(ctx,
            {
                data: {payload, accessToken, refreshToken},
                message: "登录成功"
            }
        , next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
};

/**
 * 根据payload 生成 accessToken 和 refreshToken
 * @param {Object} payload 
 * @param {Object} Model 
 * @returns [Object] accessToken, refreshToken
 */
const generateTokens = (payload, Model) => {
	let accessToken = jwtMD.generateToken(payload);
	let refreshToken = jwtMD.generateToken(payload, true);
	Model.modify_Pres({_id: payload._id}, {refreshToken, at_login: new Date()});
	return { accessToken, refreshToken };
}

/**
 * 根据账号中的 type_login 获取登录对象
 * @param {Object} body 
 * @param {Object} Model 
 * @returns [Object]
 */
const obtLoginObj_Pobj = (body, Model) => new Promise(async(resolve, reject) => {
	try {
		let type_login = body.type_login;
		if(type_login === "hat") {
			let hat = body.hat;
			if(!hat) return reject({errMsg: "请输入正确的 hat 参数 "});
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
			if(!object) return reject({errMsg: "账号错误"});
			await bcryptMD.matchBcrypt_Pnull(hat.pwd, object.pwd);
			return resolve(object);
		} else {
			return reject({errMsg: "请输入正确的 [type_login] 类型为String ['hat', 'google', 'facebook', 'weixin'] "});
		}
	} catch(e) {
		return reject(e);
	}
});