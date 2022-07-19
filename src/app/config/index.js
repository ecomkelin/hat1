/**
 * 为了统一暴露， 也为了方便 router api 查看
 */
const {LIMIT_FIND, PHONE_PRE, MONTH} = global;
const WHITE_URL = [
	"/api/v1/user/init",
	"/api/authorize/user/login",
	"/api/authorize/user/refresh",
]
module.exports = {
	LIMIT_FIND,
	PHONE_PRE,
	MONTH,
	WHITE_URL
}