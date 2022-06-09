const docName = require("../../_doc/collections").Customer; //集合的名称
const doc = require("./doc");								// 本集合 doc = {};

const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);

module.exports = Model