// 引入全局及组的 collection field
const docGlobal = require("../../docGlobal");

// 本身特殊的 field
delete docGlobal.Role;

const code = {...docGlobal.code};
code.uniq = ["Firm"];
const name = {...docGlobal.name};
name.uniq = ["Firm"];
// 打包成为集合
const docModel = {
    ...docGlobal,

    code,
    name,
    auths: [{type: String, required_min: 1}],            // 角色权限
};

// 集合名称
const docName = require("../..").Role;

// 暴露 方法 及 docModel
const Model = mongoModel(docName, docModel);
module.exports = Model;