const jwtMD = require("./jwt");

module.exports = async(ctx, next) => {
	try {
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);

		ctx.request.payload = payload;
		return next();
	} catch(e) {
		ctx.request.payload = null;
		return next();
	}
}