
const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const jwtMD = require("./jwt");

module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);

		ctx.request.payload = payload;
		return next();
	} catch(e) {
		return resJson.errs(ctx, e, next);
	}
}