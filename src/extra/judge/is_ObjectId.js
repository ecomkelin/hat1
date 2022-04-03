const { ObjectId } = require('mongoose').Types;

exports.isObjectId = id => ObjectId.isValid(id);

exports.isObjectIds = (ids) => {
	if(!ids || ids.length == 0) return false;
	let i=0
	for(; i<ids.length; i++) {
		if(!ObjectId.isValid(ids[i])) break;
	}
	return (i == ids.length) ? true : false;
}