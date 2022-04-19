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
	vip: {type: Number}
};