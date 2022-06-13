/* 数据库连接文件 */
const mongoose = require('mongoose');
/**
 * 主从数据库
 * 数据库的读写分离
 */
db_master = mongoose.createConnection(process.env.DB_MASTER, { useNewUrlParser: true, useUnifiedTopology: true});
//db_slave1 = mongoose.createConnection(process.env.DB_SLAVE1, { useNewUrlParser: true, useUnifiedTopology: true});





/**
 * 数据库方法打包文件
 */
const Schema = mongoose.Schema;
const readPre = require("./readPre");
const docSame = require("./docSame");
const path = require('path');
const { match } = require('assert');
const {LIMIT_FIND} = require(path.join(process.cwd(), "bin/server/_sysConf"));

// 暴露mongodb的方法 以及model的doc即所有field
/**
 * @param {由models中各个数据库中Model文件提供 系统初始化的时候就被加载到各个Model文件中去 不会根据每次访问重新加载COLmaster及方法}
 * @param {数据库名称} docName 
 * @param {文档中的field} doc 添加数据库 用于添加到此Model中暴露出去
 * @returns 暴露各种数据库方法
 */
module.exports = (docName, doc) => {
	const COLmaster = db_master.model(docName, new Schema(doc));
	// const COLslave1 = db_slave1.model(docName, new Schema(doc));

	/* read 一般在从数据库读数据 简单的暂时先用一个数据 如果读写分离就要用从数据库  COLread* = db_slave* */
	const COLread0 = COLmaster;
	const aggregate = (pipelines, options) => new Promise(async(resolve, reject) => {
		try {
			return resolve("功能未开放")
		} catch(e) {
			reject(e);
		}
	});
	const countDocuments = (query, options) => new Promise(async(resolve, reject) => {
		try {
			let count = await COLread0.countDocuments(query);
			return resolve(count);
		} catch(e) {
			reject(e);
		}
	});

	const list = (paramList={}) => new Promise(async(resolve, reject) => {
		try {
			let {message, paramObj} = readPre.listFilter(doc, paramList);
			if(!paramObj)  return resolve({status: 400, message});

			let {query={}, projection, skip=0, limit=LIMIT_FIND, sort={}, populate, search={}} = paramObj;
			if(!sort) sort = {sortNum: -1, at_upd: -1};
	
			let count = await COLread0.countDocuments(query);
	
			let objects = await COLread0.find(query, projection)
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
				object = await COLread0.findOne(query, projection).populate(populate);
			}

			return resolve({
				status: 200, message: "获取用户列表成功", 
				data: {count, objects, object, skip, limit},
				paramObj: {
					match: query,select: projection, skip, limit, sort, populate
				}
			});
		} catch(e) {
			reject(e);
		}
	});

	const detail = (paramDetail) => new Promise(async(resolve, reject) => {
		try {
			let {message, paramObj} = readPre.detailFilter(doc, paramDetail);
			if(!paramObj)  return resolve({status: 400, message});
			let {query={}, projection, populate} = paramObj;

			let object = await COLread0.findOne(query, projection)
				.populate(populate);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});
	const findOne = ({query={}, projection, populate}) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLread0.findOne(query, projection)
				.populate(populate);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});

	const distinct = (field, query, options) => new Promise(async(resolve, reject) => {
		try {
			field = String(field);
			let dist = await COLread0.distinct(field, query);
			return resolve(dist);
		} catch(e) {
			reject(e);
		}
	});

	/* write 写入数据 一定要在主数据库中写 */
	const COLwrite = COLmaster;
	const create = (document) => new Promise(async(resolve, reject) => {
		try {
			// 写入 auto 数据
			document.at_crt = document.at_upd = document.at_edit = new Date();
	
			// 判断数据
			let res_docSame = await docSame(COLread0, doc, document);
			if(res_docSame.status !== 200) return resolve({...res_docSame});   // 错误信息
			if(res_docSame.exist === true) return resolve({...res_docSame, status: 400});   // 如果数据库中已有相同数据

			let object = await COLwrite.create(document);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});
	const insertMany = (documents, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLwrite.insertMany(documents);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});

	const modify = (filter={}, updObj) => new Promise(async(resolve, reject) => {
		try {
			let message = docPreCT.modifyFilter(doc, updObj, id);
			if(message) return resolve({status: 400, message});

			// 写入 auto 数据
			updObj.at_edit = new Date();
	
			// 判断数据
			let res_docSame = await docSame(COLread0, doc, updObj);
			if(res_docSame.status !== 200) return resolve({...res_docSame});   // 错误信息
			if(res_docSame.exist === true) return resolve({...res_docSame, status: 400});   // 如果数据库中已有相同数据

			let object = await COLwrite.updateOne(filter, updObj);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});
	const updateMany = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLwrite.updateMany(filter, update, options);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});

	const remove = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let del = await COLwrite.deleteOne(filter);
			return resolve(del);
		} catch(e) {
			reject(e);
		}
	});
	const deleteMany = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let dels = await COLwrite.deleteMany(filter);
			return resolve(dels);
		} catch(e) {
			reject(e);
		}
	});

	// 暴露出所有数据库方法
	return {doc, aggregate, countDocuments, list, detail, findOne, distinct, insertMany, create, updateMany, modify, remove, deleteMany};
}
