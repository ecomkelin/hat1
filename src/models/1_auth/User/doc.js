const doc_global = require("../../_doc/global");
const doc_group = require("../doc_group");

const code = {...doc_group.code};
code.unique = true;
code.uniq = ["name"];

module.exports = {
    ...doc_global,

    ...doc_group,

    code,
    // 权限信息
    roleNum: {type: Number},                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    auths: [{type: String}],                                    // 用户权限
};