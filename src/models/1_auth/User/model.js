const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docName = require("../../_docConf");
const doc = require("./doc");

const path = require('path');
const {LIMIT_FIND} = require(path.join(process.cwd(), "src/config/const_var"));

const {
    conn1,
    // conn2
} = require(path.join(process.cwd(), "bin/connDBs"));

const model1 = conn1.model(docName.User, new Schema(doc));
// const model2 = conn2.model(docName.User, new Schema(doc));

/* read */
const readDB = model1;
exports.aggregate = (pipelines, options) => new Promise(async(resolve, reject) => {
    try {
        return resolve("功能未开放")
    } catch(err) {
        reject(err);
    }
});
exports.countDocuments = (query, options) => new Promise(async(resolve, reject) => {
    try {
        const count = await readDB.countDocuments(query);
        return resolve(count);
    } catch(err) {
        reject(err);
    }
});

exports.find = ({query, projection, skip=0, limit=LIMIT_FIND, sort, populate}) => new Promise(async(resolve, reject) => {
    try {
        const objects = await readDB.find(query, projection)
            .skip(skip).limit(limit)
            .sort(sort)
            .populate(populate);
        return resolve(objects);
    } catch(err) {
        reject(err);
    }
});
exports.findOne = ({query, projection, populate}) => new Promise(async(resolve, reject) => {
    try {
        const object = await readDB.findOne(query, projection)
            .populate(populate);
        return resolve(object);
    } catch(err) {
        reject(err);
    }
});

exports.distinct = (field, query, options) => new Promise(async(resolve, reject) => {
    try {
        field = String(field);
        const dist = await readDB.distinct(field, query);
        return resolve(dist);
    } catch(err) {
        reject(err);
    }
});

/* write */
const writeDB = model1;
exports.insertOne = (document, options) => new Promise(async(resolve, reject) => {
    try {
        const object = await writeDB.create(document);
        return resolve(object);
    } catch(err) {
        reject(err);
    }
});
exports.insertMany = (documents, options) => new Promise(async(resolve, reject) => {
    try {
        const object = await writeDB.insertMany(documents);
        return resolve(object);
    } catch(err) {
        reject(err);
    }
});

exports.updateOne = (filter={}, update, options) => new Promise(async(resolve, reject) => {
    try {
        const object = await writeDB.updateOne(filter, update, options);
        return resolve(object);
    } catch(err) {
        reject(err);
    }
});
exports.updateMany = (filter={}, update, options) => new Promise(async(resolve, reject) => {
    try {
        const object = await writeDB.updateMany(filter, update, options);
        return resolve(object);
    } catch(err) {
        reject(err);
    }
});

exports.deleteOne = (filter, options) => new Promise(async(resolve, reject) => {
    try {
        const del = await writeDB.deleteOne(filter);
        return resolve(del);
    } catch(err) {
        reject(err);
    }
});
exports.deleteMany = (filter, options) => new Promise(async(resolve, reject) => {
    try {
        const dels = await writeDB.deleteMany(filter);
        return resolve(dels);
    } catch(err) {
        reject(err);
    }
});