const jwtMD = require("./jwt");

module.exports = async(ctx, next) => {
	try {
		if(ctx.request.query.api == 1) return next(); // 查看api
		ctx.url = ctx.url.toLowerCase();
		if(WHITE_URL.includes(ctx.url)) return next();

		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
		ctx.request.payload = payload;

		if(payload.type_auth === 'User') {
			if(payload.is_admin) return next();
			if(payload.auths && payload.auths.includes(ctx.url)) return next();
		}

		return resNOACCESS(ctx);
		// return next();
	} catch(e) {
		return resERR(ctx, e, next);
	}
}