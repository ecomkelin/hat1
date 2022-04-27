const filterParam = (docModel, docNew, sameParam, type) => {
	for(key in docModel) {
		if(type === 'upd' && !docNew[key]) continue;			// 如果docNew 不更改此值 则不用管
		let param = {};
		if(docModel[key].unique) {
			param[key] = docNew[key];
		} else {
			let uniq = docModel[key].uniq;		// 查看数据库模型中 field 的 uniq标识	
			if(!uniq) continue;					// 如果没有 则不用查看
			if(!(uniq instanceof Array)) return `${type} 数据库 doc 的uniq值错误`;
			param[key] = docNew[key];
			for(let i=0; i<uniq.length; i++) {
				let sKey = uniq[i];
				if(docNew[sKey] === undefined) return `${type} 请传递 在新的 doc中传递 [${key}] 的值`;
				param[sKey] = docNew[sKey];
			}
		}
		sameParam["$or"].push(param);
	}
}

module.exports = (docModel, docNew) =>  {
	let sameParam = {"$or": []};			// 初始化field唯一的参数
	if(docNew._id) {			// 如果是更新
		sameParam._id = {"$ne": docNew._id};
		let message = filterParam(docModel, docNew, sameParam, 'upd');
		if(message) return [false, message];
	} else {					// 如果是创建
		let message = filterParam(docModel, docNew, sameParam, 'crt');
		if(message) return [false, message];
	}
	return [true, sameParam];		 
}

