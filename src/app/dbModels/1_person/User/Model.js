// 引入全局或组的 collection field
const docGlobal = require("../../docGlobal");

// 打包成为集合
const doc = {
    ...docGlobal,

    // 权限信息
    auths: [{type: String}],                                    // 用户权限
};

// 集合名称
const docName = require("../..").Firm;



// #################################################################
// 暴露 方法 及 doc
const path = require('path');
const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);
module.exports = Model