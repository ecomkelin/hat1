const doc_global = require("../../_doc/global");
const doc_group = require("../doc_group");

module.exports = {
    ...doc_global,

    ...doc_group,

    // 公司员工信息
	vip: {type: Number}
};