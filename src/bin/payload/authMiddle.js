const jwtMD = require("./jwt");

/**
 * 权限中间件
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
module.exports = async(ctx, next) => {
	try {
		/** 如果是查看 api 则一律通过 */
		if(ctx.request.query.api == 1) return next();

		/** 白名单一律通过 */
		ctx.url = ctx.url.toLowerCase();
		if(WHITE_URL.includes(ctx.url)) return next();

		/** 根据headers 获取payload */
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
		ctx.request.payload = payload;

		/** 根据 type_auth 分批管理 */
		if(payload.type_auth === 'User') {
			/** 如果是超级管理员 则一律通过 */
			if(payload.is_admin) return next();
			if(payload.auths && payload.auths.includes(ctx.url)) return next();
		}

		/** 没有通过的情况下 一律阻止 */
		return resNOACCESS(ctx);
		// return next();
	} catch(e) {
		return resERR(ctx, e, next);
	}
}