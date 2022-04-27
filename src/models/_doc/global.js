const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const docName = require("./collections");

module.exports = {
	code: {
		type: String,
		required: true,
		minLen: 4,
		maxLen: 20,
		regexp: '^[a-zA-Z0-9]*$',
		is_fixed: true,
	},
	name: {
		type: String,
        minLen: 4,
        maxLen: 20,
        regexp: '^[a-zA-Z0-9]*$',
    },

	is_usable: {type: Boolean, default: true},                  // 是否可用
	sortNum: {type: Number},

	at_crt: {type: Date, is_auto: true, is_fixed: true},
    User_crt_db: {type: ObjectId, ref: docName.User, is_auto: true, is_fixed: true},       // 创建人

	at_upd: {type: Date, is_auto: true},                                // 最近一次更新时间
    User_upd_db: {type: ObjectId, ref: docName.User, is_auto: true},    // 除了自己更新的人
    updObjs: [{
        at_upd: {type: Date, is_auto: true},
        User_upd_db: {type: ObjectId, ref: docName.User, is_auto: true},    // 除了自己更新的人
    }],

	Firm_db: {type: ObjectId, ref: docName.Firm, is_fixed: true},              // 所属公司
	Shop_db: {type: ObjectId, ref: docName.Shop, is_fixed: true},              // 所属分公司
};