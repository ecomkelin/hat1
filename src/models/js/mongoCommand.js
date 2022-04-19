const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const path = require('path');
const {LIMIT_FIND} = require(path.join(process.cwd(), "bin/_sysConf"));

const {
    db_master,
    // db_slave1
} = require(path.join(process.cwd(), "bin/connDBs"));



module.exports = (docName, doc) => {
	const DBmaster = db_master.model(docName, new Schema(doc));
	// const DBslave1 = db_slave1.model(docName, new Schema(doc));
	
	/* read */
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
			const count = await DBread0.countDocuments(query);
			return resolve(count);
		} catch(err) {
			reject(err);
		}
	});

	const find = ({query, projection, skip=0, limit=LIMIT_FIND, sort, populate}) => new Promise(async(resolve, reject) => {
		try {
			const objects = await DBread0.find(query, projection)
				.skip(skip).limit(limit)
				.sort(sort)
				.populate(populate);
			return resolve(objects);
		} catch(err) {
			reject(err);
		}
	});
	const findOne = ({query, projection, populate}) => new Promise(async(resolve, reject) => {
		try {
			const object = await DBread0.findOne(query, projection)
				.populate(populate);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const distinct = (field, query, options) => new Promise(async(resolve, reject) => {
		try {
			field = String(field);
			const dist = await DBread0.distinct(field, query);
			return resolve(dist);
		} catch(err) {
			reject(err);
		}
	});

	/* write */
	const DBwrite = DBmaster;
	const insertOne = (document, options) => new Promise(async(resolve, reject) => {
		try {
			const object = await DBwrite.create(document);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});
	const insertMany = (documents, options) => new Promise(async(resolve, reject) => {
		try {
			const object = await DBwrite.insertMany(documents);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const updateOne = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			const object = await DBwrite.updateOne(filter, update, options);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});
	const updateMany = (filter={}, update, options) => new Promise(async(resolve, reject) => {
		try {
			const object = await DBwrite.updateMany(filter, update, options);
			return resolve(object);
		} catch(err) {
			reject(err);
		}
	});

	const deleteOne = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			const del = await DBwrite.deleteOne(filter);
			return resolve(del);
		} catch(err) {
			reject(err);
		}
	});
	const deleteMany = (filter, options) => new Promise(async(resolve, reject) => {
		try {
			const dels = await DBwrite.deleteMany(filter);
			return resolve(dels);
		} catch(err) {
			reject(err);
		}
	});

	return {doc, aggregate, countDocuments, find, findOne, distinct, insertMany, insertOne, updateMany, updateOne, deleteOne, deleteMany};
}
