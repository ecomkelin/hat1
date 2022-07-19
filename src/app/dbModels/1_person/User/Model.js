// 引入全局及组的 collection field
const path = require('path');
const {ObjectId} = global;
const doc_group = require("../doc_group");
// #################################################################
// global 最上面 group中间 本身最下
const docNameObj = require("../../index");

// 本身特殊的 field
const code = {...doc_group.code};
code.unique = true;
// 打包成为集合
const doc = {
    ...doc_group,

    code,
    // 权限信息
    type_auth: {type: String, default: 'User', is_auto: true, is_fixed: true},   // <后台自动添加> User / Customer / Supplier

    Roles: [{type: ObjectId, ref: docNameObj.Role}],
    auths: [{type: String}],                                                    // 用户权限 可选
    // 特殊的 为了身份验证
    is_admin: {type: Boolean, default: false, true_unique: true, is_auto: true, is_fixed: true},    // 每个公司有且只有一个为true
    rankNum: {type: Number, default: 1, minNum: 1, maxNum: 9, is_change: true},  // 等级制度 修改用户时 只能修改自己或比自己等级低的用户
};

// 集合名称
const docName = require("../..").User;

// #################################################################
// 暴露 方法 及 doc
const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);
module.exports = Model