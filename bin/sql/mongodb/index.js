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
const docSame = require("./docSame");
const path = require('path');
const {LIMIT_FIND} = require(path.join(process.cwd(), "bin/server/_sysConf"));

// 暴露mongodb的方法 以及model的doc即所有field
/**
 * @param {由models中各个数据库中index文件提供 系统初始化的时候就被加载到各个index文件中去 不会根据每次访问重新加载DBmaster及方法}
 * @param {数据库名称} docName 
 * @param {文档中的field} doc 添加数据库 用于添加到此Model中暴露出去
 * @returns 暴露各种数据库方法
 */
module.exports = (docName, doc) => {
	const DBmaster = db_master.model(docName, new Schema(doc));
	// const DBslave1 = db_slave1.model(docName, new Schema(doc));

	/* read 一般在从数据库读数据 简单的暂时先用一个数据 如果读写分离就要用从数据库  DBread* = db_slave* */
	const DBread0 = DBmaster;
	const aggregate = (pipelines, options) => new Promise(async(resolve, reject) => {
		try {
			return resolve("功能未开放")
		} catch(err) {
			reject(err);
		}
	});
	const countDocuments = (query, options) => new Promise(async(resolve, reject) => {
		try {
			let count = await DBread0.countDocuments(query);
			return resolve(count);
		} catch(err) {
			reject(err);
		}
	});

	const list = require("./method/list")(DBread0);
	const findOne = ({query, projection, populate}) => new Promise(async(resolve, reject) => {
		try {
			let object = await DBread0.findOne(query, projection)
				.populate(populate);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const distinct = (field, query, options) => new Promise(async(resolve, reject) => {
		try {
			field = String(field);
			let dist = await DBread0.distinct(field, query);
			return resolve(dist);
		} catch(err) {
			reject(err);
		}
	});

	/* write 写入数据 一定要在主数据库中写 */
	const DBwrite = DBmaster;
	const insertOne = (document, options) => new Promise(async(resolve, reject) => {
		try {
			// 写入 auto 数据
			document.at_crt = document.at_upd = document.at_edit = new Date();
	
			// 判断数据
			let res_docSame = await docSame(DBread0, doc, document);
			if(res_docSame.status === 200) return resolve({...res_docSame, status: 400});   // 如果数据库中已有相同数据

			let object = await DBwrite.create(document);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});
	const insertMany = (documents, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await DBwrite.insertMany(documents);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const updateOne = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			// 写入 auto 数据
			update.at_edit = new Date();
	
			// 判断数据
			let res_docSame = await docSame(DBread0, doc, update);
			if(res_docSame.status === 200) return resolve({...res_docSame, status: 400});   // 如果数据库中已有相同数据

			let object = await DBwrite.updateOne(filter, update, options);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});
	const updateMany = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await DBwrite.updateMany(filter, update, options);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const deleteOne = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let del = await DBwrite.deleteOne(filter);
			return resolve(del);
		} catch(err) {
			reject(err);
		}
	});
	const deleteMany = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let dels = await DBwrite.deleteMany(filter);
			return resolve(dels);
		} catch(err) {
			reject(err);
		}
	});

	// 暴露出所有数据库方法
	return {doc, aggregate, countDocuments, list, findOne, distinct, insertMany, insertOne, updateMany, updateOne, deleteOne, deleteMany};
}
