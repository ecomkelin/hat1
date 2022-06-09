// 引入全局及组的 collection field
const doc_global = require("../_doc/docGlobal");
const doc_group = require("./doc_group");

// 本身特殊的 field
const vip = {type: Number}; // 会员信息

// 打包成为集合
const doc = {
    ...doc_global,
    ...doc_group,

	vip
};

// 集合名称
const docName = require("../_doc/collections").Customer;


// 暴露 方法 及 doc
const path = require('path');
const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);
module.exports = Model