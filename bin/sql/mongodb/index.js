/**
 * @description: 链接数据库, 打包mongoose语法, 每个Model引入
 * @author: kelin
 */
 const path = require('path');
 const {DB_MASTER} = require(path.resolve(process.cwd(), "bin/config/env"));
 const {LIMIT_FIND} = require(path.resolve(process.cwd(), "src/app/config"));
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
const readPre = require("./readPre");
const docSame = require("./docSame");

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
	const aggregate_Prom = (pipelines, options) => new Promise(async(resolve, reject) => {
		try {
			return reject("功能未开放")
		} catch(e) {
			return reject(e);
		}
	});

	const list_Pres = (paramList={}) => new Promise(async(resolve, reject) => {
		try {
			let paramObj = await readPre.listFilter_Pobj(doc, paramList);

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
				message: "获取数据列表成功", 
				data: {count, objects, object, skip, limit},
				paramObj
			});
		} catch(e) {
			return reject(e);
		}
	});

	const detail_Pres = (paramDetail) => new Promise(async(resolve, reject) => {
		try {
			let paramObj = await readPre.detailFilter_Pobj(doc, paramDetail);

			let {query={}, projection, populate} = paramObj;

			let object = await COLread0.findOne(query, projection)
				.populate(populate);
			if(!object) return resolve({status: 400, message: "数据库中无此数据"});
			return resolve({message: "查看数据详情成功", data: {object}, paramObj});
		} catch(e) {
			reject(e);
		}
	});
	const findOne_Pobj = ({query={}, projection, populate}) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLread0.findOne(query, projection)
				.populate(populate);
			return resolve(object);
		} catch(e) {
			reject(e);
		}
	});

	/* write 写入数据 一定要在主数据库中写 */
	const COLwrite = COLmaster;
	const create_Pres = (document) => new Promise(async(resolve, reject) => {
		try {
			// 写入 auto 数据
			document.at_crt = document.at_upd = document.at_edit = new Date();
			// 判断数据
			await docSame.passNotExist_Pnull(COLread0, doc, document);	// 如果不存在就通过 存在就报错
			let object = await COLwrite.create(document);
			return resolve({data: {object}, message: "数据创建成功"});
		} catch(e) {
			reject(e);
		}
	});
	const createMany_Pres = (documents, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLwrite.insertMany(documents);
			return resolve({data: {object}});
		} catch(e) {
			reject(e);
		}
	});

	const modify_Pres = (filter={}, updObj) => new Promise(async(resolve, reject) => {
		try {
			// 写入 auto 数据
			updObj.at_edit = new Date();
	
			// 判断数据
			await docSame.passNotExist_Pnull(COLread0, doc, updObj);	// 如果不存在就通过 存在就报错

			let object = await COLwrite.updateOne(filter, updObj);
			return resolve({data: {object}});
		} catch(e) {
			reject(e);
		}
	});
	const modifyMany_Pres = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			let object = await COLwrite.updateMany(filter, update, options);
			return resolve({data: {object}});
		} catch(e) {
			reject(e);
		}
	});

	const remove_Pres = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let del = await COLwrite.deleteOne(filter);
			if(del.deletedCount === 0) return resolve({status: 400, message: "数据删除失败"});
			return resolve({message: "数据删除成功", data: {del}});
		} catch(e) {
			reject(e);
		}
	});
	const removeMany_Pres = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			let dels = await COLwrite.deleteMany(filter);
			return resolve(dels);
		} catch(e) {
			reject(e);
		}
	});
	// 暴露出所有数据库方法
	return {
		doc, 
		aggregate_Prom, 
		list_Pres, 
		detail_Pres, findOne_Pobj, 
		createMany_Pres, create_Pres,
		modifyMany_Pres, modify_Pres,
		remove_Pres, removeMany_Pres,

		create:COLwrite.create,
	};
}
