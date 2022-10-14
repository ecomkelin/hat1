// 引入全局及组的 collection field
const globalModel = require("../../globalModel");

// 本身特殊的 field
delete globalModel.Role;

const code = {...globalModel.code};
code.uniq = ["Firm"];
const name = {...globalModel.name};
name.uniq = ["Firm"];
// 打包成为集合
const docModel = {
    ...globalModel,

    code,
    name,
    auths: [{type: String, required_min: 1}],            // 角色权限
};

// 集合名称
const docName = require("../..").Role;

// 暴露 方法 及 docModel
const Model = mongoModel(docName, docModel);
module.exports = Model;