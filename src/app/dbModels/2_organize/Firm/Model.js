// 引入全局及组的 collection field
const docGroup = require("../docGroup");

// 本身特殊的 field
delete docGroup.Firm;

const code = {...docGroup.code};
code.unique = true;
// 打包成为集合
const docModel = {
    ...docGroup,

    code,
};

// 集合名称
const docName = require("../..").Firm;

// 暴露 方法 及 docModel
const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, docModel);
module.exports = Model;