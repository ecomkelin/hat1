const doc_global = require("../../_doc/global");
const doc_group = require("../doc_group");

module.exports = {
    ...doc_global,

    ...doc_group,

    // 会员信息
	vip: {type: Number}
};