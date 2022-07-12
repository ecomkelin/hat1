// 引入全局及组的 collection field
const doc_group = require("../doc_group");
// #################################################################
// global 最上面 group中间 本身最下


// 本身特殊的 field
const code = {...doc_group.code};
code.unique = true;
// 打包成为集合
const doc = {
    ...doc_group,

    code,
    // 权限信息
    roleNum: {
        type: Number
    },                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    auths: [{type: String}],                                    // 用户权限
};

// 集合名称
const docName = require("../..").User;



// #################################################################
// 暴露 方法 及 doc
const path = require('path');
const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);
module.exports = Model