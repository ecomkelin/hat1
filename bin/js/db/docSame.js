/**
 * 
 * @param {*} doc 文档模型
 * @param {*} docNew 需要创建或更新的文档
 * @param {*} query 指针类型的数据： 重要 要操作的数据
 * @param {*} type 判断是创建还是更新内容
 * @returns 如果错误就返回错误信息
 */
 const filterParam_Pobj = (doc, docNew) => new Promise((resolve, reject) => {
	try {
		let or_field = [];			// 初始化field唯一的参数
		let type = docNew._id ? 'upd' : 'crt';

		for(key in doc) {		// 循环文档中的每个field
			if(type === 'upd' && !docNew[key]) continue;			// 如果是更新文档 对于不更改的值 则可以忽略不判断;
			
			let param = {};
			if(doc[key].unique) {								// 判断field是否为unique 如果是unique 则不需要判断其他的
				param[key] = docNew[key];
			} else if(doc[key].uniq) {
				let uniq = doc[key].uniq;		// 查看数据库模型中 field 的 uniq标识	比如 公司中员工账号唯一 code.uniq = ["Firm"]
				if(!(uniq instanceof Array)) return reject({status: 400, message: `${type} 数据库 doc 的uniq值错误`});
				param[key] = docNew[key];			// 相当于 {code: '员工编号'}
				for(let i=0; i<uniq.length; i++) {
					let sKey = uniq[i];
					if(docNew[sKey] === undefined) return reject({status: 400, message: `${type} 请传递 在新的 doc中传递 [${key}] 的值`});
					param[sKey] = docNew[sKey];		// 相当于 {Firm: 'FirmId'}
				}
				// 循环下来 
				// {code: "001", Firm: "FirmId"} xd公司中是否有 001这个员工编号
				// 折扣编号 {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
			} else if(doc[key].true_unique && docNew[key] === true) {
				// 查看数据库模型中 field 的 true_unique 标识 本文档中 只能有一个为真的数据
				param[key] = docNew[key];			// 相当于 {is_admin: '是否为超级用户'}
			} else if(doc[key].true_uniq && docNew[key] === true) {
				// 查看数据库模型中 field 的 true_uniq标识	
				//比如 公司中员工账号唯一 is_default.true_uniq = ["Firm"] 整个公司只能有一个用户 的 is_default 为true
				let true_uniq = doc[key].true_uniq;	
				if(!(true_uniq instanceof Array)) return reject({status: 400, message: `${type} 数据库 doc 的true_uniq值错误`});
				param[key] = docNew[key];			// 相当于 {is_default: '是否为默认数据'}
				for(let i=0; i<true_uniq.length; i++) {
					let sKey = true_uniq[i];
					if(docNew[sKey] === undefined) continue;
					param[sKey] = docNew[sKey];		// 相当于 {Firm: 'FirmId'}
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
 * 
 * @param {*} DBcollection: 数据库模型
 * @param {*} doc: 模型 模型field
 * @param {*} docNew: 要创建或修改的 文档数据
 * @returns 如果数据库中有相同的数据 则返回相应文档
 */

 exports.passExist_Pobj = (DBcollection, doc, docNew) => new Promise(async(resolve, reject) => {
	try {
				
		let query = await filterParam_Pobj(doc, docNew);
		if(docNew._id) query._id = {"$ne": docNew._id};			// 如果是更新 需要加入 $ne _id

		let objSame = await DBcollection.findOne(query);
        if(objSame) return resolve(objSame);
		return reject({status: 400, message: "没有相同信息的数据", paramObj: {match: query}});
	} catch(e) {
		return reject(e);
	}
})
exports.passNotExist_Pnull = (DBcollection, doc, docNew) => new Promise(async(resolve, reject) => {
	try {
		let query = await filterParam_Pobj(doc, docNew);
		if(query === null) return resolve(null);
		if(docNew._id) query._id = {"$ne": docNew._id};			// 如果是更新 需要加入 $ne _id
		let objSame = await DBcollection.findOne(query);
        if(objSame) return reject({status: 400, message: "数据库中已有相同数据", data: {objSame}, paramObj: {match: query}});
		return resolve(null);
	} catch(e) {
		return reject(e);
	}
})