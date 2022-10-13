/**
 * 
 * @param {Object} docModel 文档模型
 * @param {Object} docObj 需要创建或更新的文档
 * @returns [Object] query
 */
 const filterParam_Pobj = (docModel, docObj) => new Promise((resolve, reject) => {
	try {
		let or_field = [];			// 初始化field唯一的参数
		let type = docObj._id ? 'upd' : 'crt';

		for(key in docModel) {		// 循环文档中的每个field
			if(type === 'upd' && !docObj[key]) continue;			// 如果是更新文档 对于不更改的值 则可以忽略不判断;

			let param = {};
			if(docModel[key].unique) {								// 判断field是否为unique 如果是unique 则不需要判断其他的
				param[key] = docObj[key];
			} else if(docModel[key].uniq) {
				let uniq = docModel[key].uniq;		// 查看数据库模型中 field 的 uniq标识	比如 公司中员工账号唯一 code.uniq = ["Firm"]
				if(!(uniq instanceof Array)) return reject({errMsg: `${type} 数据库 docModel 的uniq值错误`});
				param[key] = docObj[key];			// 相当于 {code: '员工编号'}
				for(let i=0; i<uniq.length; i++) {
					let sKey = uniq[i];
					if(docObj[sKey] === undefined) return reject({errMsg: `${type} 请传递 在新的 doc中传递 [${key}] 的值`});
					param[sKey] = docObj[sKey];		// 相当于 {Firm: 'FirmId'}
				}
				// 循环下来 
				// {code: "001", Firm: "FirmId"} xd公司中是否有 001这个员工编号
				// 折扣编号 {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
			} else if(docModel[key].true_unique && docObj[key] === true) {
				// 查看数据库模型中 field 的 true_unique 标识 本文档中 只能有一个为真的数据
				param[key] = docObj[key];			// 相当于 {is_admin: '是否为超级用户'}
			} else if(docModel[key].true_uniq && docObj[key] === true) {
				// 查看数据库模型中 field 的 true_uniq标识	
				//比如 公司中员工账号唯一 is_default.true_uniq = ["Firm"] 整个公司只能有一个用户 的 is_default 为true
				let true_uniq = docModel[key].true_uniq;	
				if(!(true_uniq instanceof Array)) return reject({errMsg: `${type} 数据库 docModel 的true_uniq值错误`});
				param[key] = docObj[key];			// 相当于 {is_default: '是否为默认数据'}
				for(let i=0; i<true_uniq.length; i++) {
					let sKey = true_uniq[i];
					if(docObj[sKey] === undefined) continue;
					param[sKey] = docObj[sKey];		// 相当于 {Firm: 'FirmId'}
				}
				// 循环下来 
				// {is_default: true, Firm: "FirmId"} xd公司中是否有 001这个员工编号
			}
			if(Object.keys(param).length > 0) or_field.push(param);
		}
		let query = null;
		if(or_field.length > 0) query={"$or": or_field};
		return resolve(query);
	} catch(e) {
		return reject(e);
	}
})

/**
 * 如果有 则通过
 * @param {Model Object} read_DB: modeleDB
 * @param {Object} docModel: 数据库模型 模型field
 * @param {Object} docObj: 要创建或修改的 文档数据
 * @returns [Object DB] 如果数据库中没有数据 则返回没有的错误信息, 如果有 则成功该信息
 */
 exports.passExist_Pobj = (read_DB, docModel, docObj) => new Promise(async(resolve, reject) => {
	try {
		let query = await filterParam_Pobj(docModel, docObj);
		if(docObj._id) query._id = {"$ne": docObj._id};			// 如果是更新 需要加入 $ne _id

		let objSame = await read_DB.findOne(query);
        if(objSame) return resolve(objSame);
		return reject({errMsg: "没有相同信息的数据", paramObj: {match: query}});
	} catch(e) {
		return reject(e);
	}
})

/**
 * 如果没有则通过
 * @param {Model Object} read_DB 
 * @param {Object} docModel 数据库文档
 * @param {Object} docObj 前台传入的数据
 * @returns [null] 如果数据库中有相同的数据 则返回相应文档
 */
exports.passNotExist_Pnull = (read_DB, docModel, docObj) => new Promise(async(resolve, reject) => {
	try {
		let query = await filterParam_Pobj(docModel, docObj);
		if(query === null) return resolve(null);
		if(docObj._id) query._id = {"$ne": docObj._id};			// 如果是更新 需要加入 $ne _id

		let objSame = await read_DB.findOne(query);
        if(objSame) return reject({errMsg: "数据库中已有相同数据", data: {objSame}, paramObj: {match: query}});
		return resolve(null);
	} catch(e) {
		return reject(e);
	}
})