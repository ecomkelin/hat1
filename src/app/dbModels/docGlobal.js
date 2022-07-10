/**
 * @description  全局集合的数据特征集合
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 数据库名称集合
const docName = require(".");

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

	at_upd: {type: Date, is_auto: true},                                // [绝对] 最近一次更新时间 只要数文档更新
	at_edit: {type: Date, is_auto: true}, 								// 最近的修改时间 本身的修改
	// User_upd: {type: ObjectId, ref: docName.User, is_auto: true},    // 除了自己更新的人
    // updObjs: [{
    //     at_upd: {type: Date, is_auto: true},
    //     User_upd: {type: ObjectId, ref: docName.User, is_auto: true},    // 除了自己更新的人
    // }],

	Firm_db: {type: ObjectId, ref: docName.Firm, is_fixed: true},              // 所属公司
	Shop_db: {type: ObjectId, ref: docName.Shop, is_fixed: true},              // 所属分公司


	// 员工编号： {code: "001", Firm: "firmId"} xd公司中是否有 001这个员工编号
	// 产品名称： {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
	// 折扣映射： Brand.uniq = ["Supplier"]; 添加折扣文档时 同一个供应商不能有相同的品牌
	// const field = {
	//     // type: ...
	//     // is_auto: ...
	//     // uniq: ['field1', 'field2']
	// }
	// field.uniq = ['field1', 'field2'];
};