
const path = require('path');
const jwtMD = require(path.resolve(process.cwd(), "bin/middle/jwt"));

const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);

		ctx.request.payload = payload;
		return next();
	} catch(e) {
		return resJson.errs(ctx, {e});
	}
}