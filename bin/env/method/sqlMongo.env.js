const { ObjectId } = require('mongoose').Types;
isObjectId = id => ObjectId.isValid(id);

/**
 * 数组里的 元素是否全为 ObjectId
 * @param {Array} ids: 要排序的数组
* returns [Boolean]
 */
isAllObjectId = (ids) => {
	if (!ids || ids.length == 0) return false;
	let i = 0
	for (; i < ids.length; i++) {
		if (!ObjectId.isValid(ids[i])) break;
	}
	return (i == ids.length) ? true : false;
}

writePass_Pnull = require(path.resolve(process.cwd(), "bin/sql/writePre")).writePass_Pnull;
mongoModel = require(path.resolve(process.cwd(), "bin/sql/mongodb"));