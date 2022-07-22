// 引入全局及组的 collection field
const docGroup = require("../docGroup");

// 本身特殊的 field
delete docGroup.Firm;

const code = {...docGroup.code};
code.unique = true;
// 打包成为集合
const doc = {
    ...docGroup,

    code,
};

// 集合名称
const docName = require("../..").Firm;

// 暴露 方法 及 doc
const Model = require(global.path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);
module.exports = Model;