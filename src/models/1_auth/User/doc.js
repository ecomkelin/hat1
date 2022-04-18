const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const docName = require("../../_docConf");

const doc_pub = require("../../doc_pub");
const doc_group = require("../doc_group");

module.exports = {
    ...doc_pub,

    ...doc_group,

    // 公司员工信息
    Firm_db: {type: ObjectId, ref: docName.Firm},              // 所属公司
    roleNum: {type: Number},                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    Shop_db: {type: ObjectId, ref: docName.Shop},              // 所属分公司
    auths: [{type: String}],                                    // 用户权限
};