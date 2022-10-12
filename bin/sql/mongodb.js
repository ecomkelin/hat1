/**
 * @description: 链接数据库, 打包mongoose语法, 每个Model引入
 * @author: kelin
 */
 /* 数据库连接文件 */
const mongoose = require('mongoose');
/**
 * 主从数据库
 * 数据库的读写分离
 */
const db_master = mongoose.createConnection(DB_MASTER, { useNewUrlParser: true, useUnifiedTopology: true});
//const db_slave1 = mongoose.createConnection(DB_SLAVE1, { useNewUrlParser: true, useUnifiedTopology: true});





/**
 * 数据库方法打包文件
 */
const Schema = mongoose.Schema;
const writePre = require("./writePre");
const readPre = require("./readPre");
const docSame = require("./docSame");
// 暴露mongodb的方法 以及model的doc即所有field
/**
 * 由models中各个数据库中Model文件提供 系统初始化的时候就被加载到各个Model文件中去 不会根据每次访问重新加载COLmaster及方法
 * @param {数据库名称} docName 
 * @param {文档中的field} doc 添加数据库 用于添加到此Model中暴露出去
 * @returns [Function] 暴露各种数据库方法
 */
module.exports = (docName, doc) => {
	const COLmaster = db_master.model(docName, new Schema(doc));
	// const COLslave1 = db_slave1.model(docName, new Schema(doc));

	/* read 一般在从数据库读数据 简单的暂时先用一个数据 如果读写分离就要用从数据库  COLread* = db_slave* */
	const COLread0 = COLmaster;
	const aggregate_Prom = (pipelines, options) => new Promise(async(resolve, reject) => {
		try {
			return reject("功能未开放")
		} catch(e) {
			return reject(e);
		}
	});

	const list_Pres = (paramObj={}) => new Promise(async(resolve, reject) => {
		try {
			// let {filter, select={}, skip, limit, sort, populate} = paramObj;
			let param = readPre.obtParam_readManyPre(doc, paramObj);
			if(param.errMsg) return reject({ errMsg: param.errMsg })

			let {match={}, projection, skip=0, limit=LIMIT_FIND, sort, populate, search={}} = param;
			if(!sort) sort = {sortNum: -1, at_upd: -1};
	
			let count = await COLread0.countDocuments(match);
	
			let objects = await COLread0.find(match, projection)
				.skip(skip).limit(limit)
				.sort(sort)
				.populate(populate);
	
			let object = null;
			let {fields, keywords} = search;
			if(objects.length > 0 && fields && keywords) {
				match["$or"] = [];
				fields.forEach(field => {
					match["$or"].push({[field]: { $regex: keywords, $options: '$i' }})
				});
				object = await COLread0.findOne(match, projection).populate(populate);
			}

			return resolve({
				message: "获取数据列表成功", 
				data: {count, objects, object, skip, limit},
				param
			});
		} catch(e) {
			return reject(e);
		}
	});

	const detail_Pobj = (paramObj={}) => new Promise(async(resolve, reject) => {
		try {
			let param = readPre.obtParam_readOnePre(doc, paramObj);
			if(param.errMsg) return reject({ errMsg: param.errMsg })

			let {match={}, projection, populate} = param;

			let object = await COLread0.findOne(match, projection)
				.populate(populate);
			if(!object) {
				let noAuth_object = await COLread0.findOne({_id: match._id}, {_id: 1});
				if(noAuth_object) return reject({errMsg: "您没有权限访问此数据"});
				return reject({errMsg: "没有匹配到此数据"});
			}
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});
	const findOne_Pobj = ({match={}, projection, populate}) => new Promise(async(resolve, reject) => {
		try {
			if(match._id && !isObjectId(match._id)) return reject({errMsg: "_id为 ObjectId 类型"})

			let object = await COLread0.findOne(match, projection)
				.populate(populate);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});

	/* write 写入数据 一定要在主数据库中写 */
	const COLwrite = COLmaster;
	const create_Pres = (document, options={}) => new Promise(async(resolve, reject) => {
		try {
			let {is_pass = false} = options;
			if(!is_pass) await writePre.writePass_Pnull(doc, document);

			await docSame.passNotExist_Pnull(COLread0, doc, document);	// 如果不存在就通过 存在就报错
			let object = await COLwrite.create(document);
			if(!object) return reject({errMsg: "创建数据失败"});
			return resolve({data: {object}, message: "数据创建成功"});
		} catch(e) {
			reject(e);
		}
	});
	const createMany_Pres = (documents) => new Promise(async(resolve, reject) => {
		try {
			let objects = await COLwrite.insertMany(documents);
			return resolve({data: {objects}});
		} catch(e) {
			reject(e);
		}
	});

	const modify_Pres = (match={}, update, is_pass=false) => new Promise(async(resolve, reject) => {
		try {
			if(!is_pass) await writePre.writePass_Pnull(doc, update, {is_modify: true});			// 写入数据是否符合

			await docSame.passNotExist_Pnull(COLread0, doc, update);	// 如果不存在就通过 存在就报错
			
			let updateOne = await COLwrite.updateOne(match, update);
			return resolve({updateOne});
		} catch(e) {
			reject(e);
		}
	});
	const modifyMany_Pres = (paramObj, update) => new Promise(async(resolve, reject) => {
		try {
			let param = readPre.obtParam_readManyPre(doc, paramObj);
			if(param.errMsg) return reject({ errMsg: param.errMsg })

			let {match={}} = param;
			let updateMany = await COLwrite.updateMany(match, update);
			if(updateMany.matchedCount === 0) return resolve({errMsg: "没有更改任何数据"});
			return resolve({updateMany});
		} catch(e) {
			reject(e);
		}
	});



	const remove_Pres = (match) => new Promise(async(resolve, reject) => {
		try {
			let del = await COLwrite.deleteOne(match);
			if(del.deletedCount === 0) return resolve({errMsg: "数据删除失败"});
			return resolve({message: "数据删除成功", del});
		} catch(e) {
			reject(e);
		}
	});
	const removeMany_Pres = (paramObj ={}) => new Promise(async(resolve, reject) => {
		try {
			let param = readPre.obtParam_readManyPre(doc, paramObj);
			if(param.errMsg) return reject({ errMsg: param.errMsg })

			let {match={}} = param;

			let deleteMany = await COLwrite.deleteMany(match);
			if(deleteMany.deletedCount === 0) return resolve({errMsg: "没有删除任何数据"});
			return resolve(deleteMany);
		} catch(e) {
			reject(e);
		}
	});
	// 暴露出所有数据库方法
	return {
		doc, 
		aggregate_Prom, 
		list_Pres, 
		detail_Pobj, findOne_Pobj, 
		createMany_Pres, create_Pres,
		modifyMany_Pres, modify_Pres,
		remove_Pres, removeMany_Pres,
	};
}
