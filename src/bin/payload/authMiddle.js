const jwtMD = require("./jwt");
const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const {WHITE_URL} = require(path.resolve(process.cwd(), "src/app/config"));

module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
		ctx.request.payload = payload;

		ctx.url = ctx.url.toLowerCase();

		if(WHITE_URL.includes(ctx.url)) return next();
		if(payload.type_auth === 'User') {
			if(payload.is_admin) return next();
			if(payload.auths && payload.auths.includes(ctx.url)) return next();
		}

		return resJson.noAccess(ctx);
		// return next();
	} catch(e) {
		return resJson.errs(ctx, e, next);
	}
}