// 引入全局及组的 collection field
const groupModel = require("../groupModel");

// 本身特殊的 field
delete groupModel.Firm;

const code = {...groupModel.code};
code.unique = true;
// 打包成为集合
const docModel = {
    ...groupModel,

    code,
};

// 集合名称
const docName = require("../..").Firm;

// 暴露 方法 及 docModel
const Model = mongoModel(docName, docModel);
module.exports = Model;