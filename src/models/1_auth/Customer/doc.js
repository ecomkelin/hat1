const docGlobal = require("../../_doc/docGlobal");
const doc_group = require("../doc_group");

module.exports = {
    ...docGlobal,

    ...doc_group,

    // 会员信息
	vip: {type: Number}
};