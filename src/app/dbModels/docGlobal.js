/**
 * @description  全局集合的数据特征集合
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 数据库名称集合
const docNameObj = require(".");

module.exports = {
	code: {
		type: String,
		required: true,
		minLen: 2,
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
    User_crt_db: {type: ObjectId, ref: docNameObj.User, is_auto: true, is_fixed: true},       // 创建人

	at_upd: {type: Date, is_auto: true},                                // [绝对] 最近一次更新时间 只要数文档更新
	at_edit: {type: Date, is_auto: true}, 								// 最近的修改时间 本身的修改
	// User_upd: {type: ObjectId, ref: docNameObj.User, is_auto: true},    // 除了自己更新的人
    // updObjs: [{
    //     at_upd: {type: Date, is_auto: true},
    //     User_upd: {type: ObjectId, ref: docNameObj.User, is_auto: true},    // 除了自己更新的人
    // }],

	Firm_db: {type: ObjectId, ref: docNameObj.Firm, is_fixed: true},              // 所属公司
	Shop_db: {type: ObjectId, ref: docNameObj.Shop, is_fixed: true},              // 所属分公司

};

/**
 * type mongodb数据库类型 (此字段为 mongoose 自带类型 本系统没有做判定)
 * required [Boolean] 是否为必须填写的, 如果为 true 添加时必须要有此数据 (此字段为 mongoose 自带类型 本系统没有做判定)
 * is_auto [Boolean] 是否为自动更新， 如果为 true 则前端不能给数据 给数据就报错
 * is_fixed [Boolean] 字段是否可以修改, 如果为 true 则前端不可给此字段修改数据
 * trimLen [Number] (所属字段必须为 String 类型) 字段的固定长度  的正整数
 * minLen [Number] (所属字段必须为 String 类型) 字段的最小长度  的正整数
 * maxLen [Number] (所属字段必须为 String 类型) 字段的最大长度  的正整数
 * regexp [正则表达式] (所属字段必须为 String 类型) 字段要符合的正则表达式
 * 
 * saveChange [Boolean] 保存之前要更改数据
 * is_hideRead [Boolean] 不可读取此数据 比如 密码
 * 
 * unique [Boolean] 是否是唯一的, 如果为 true 则本字段中有且只有一个此值 (此字段为 mongoose 自带类型 本系统 在 docSame 中 也做了判定)
 * uniq [Array[其他字段]]  
 * 	// 员工编号： {code: "001", Firm: "firmId"} xd公司中是否有 001这个员工编号
	// 产品名称： {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
	// 折扣映射： Brand.uniq = ["Supplier"]; 添加折扣文档时 同一个供应商不能有相同的品牌
	// const field = {
	//     // type: ...
	//     // is_auto: ...
	//     // uniq: ['field1', 'field2']
	// }
	// field.uniq = ['field1', 'field2'];
	比如：
 	code: {
		type: String,
		uniq: ['Firm']
	}
 */