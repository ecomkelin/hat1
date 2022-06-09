module.exports = (DB) => (paramObj={}) => new Promise(async(resolve, reject) => {
	try {

		// to do 查找数据库
		let {match: query={}, select: projection, skip=0, limit=LIMIT_FIND, sort={}, populate, search={}} = paramObj;
		if(!sort) sort = {sortNum: -1, at_crt: -1};

		let count = await DB.countDocuments(query);

		let objects = await DB.find(query, projection)
			.skip(skip).limit(limit)
			.sort(sort)
			.populate(populate);

		let object = null;
		let {fields, keywords} = search;
		if(objects.length > 0 && fields && keywords) {
			query["$or"] = [];
			fields.forEach(field => {
				query["$or"].push({[field]: { $regex: keywords, $options: '$i' }})
			});
			object = await DB.findOne(query, projection).populate(populate);
		}

		return resolve({
			status: 200, message: "获取用户列表成功", 
			data: {count, objects, object, skip, limit},
			paramObj: {
				match: query,select: projection, skip, limit, sort, populate
			}
		});
	} catch(err) {
		console.error(err);
		reject(err);
	}
});