/**
 * 为了统一暴露， 也为了方便 router api 查看
 */
const path = require('path');
const {LIMIT_FIND, PHONE_PRE, MONTH} = require(path.join(process.cwd(), "bin/config/const_var"));

module.exports = {
	LIMIT_FIND,
	PHONE_PRE,
	MONTH
}