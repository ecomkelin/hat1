/**
 * @description  全局集合的数据特征集合
 * 
 */
const {ObjectId} = global;


// 数据库名称集合
const docNameObj = require("./index");

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
        minLen: 1,
        maxLen: 20
    },
	img_url: {type: String},

	is_usable: {type: Boolean, default: true},                  // 是否可用
	sortNum: {type: Number},

	at_crt: {type: Date, is_autoDate: true, is_fixed: true},
    User_crt: {type: ObjectId, ref: docNameObj.User, autoPayload: "_id", is_fixed: true},       // 创建人

	at_upd: {type: Date, is_autoDate: true},                                // [绝对] 最近一次更新时间 只要数文档更新
	User_upd: {type: ObjectId, ref: docNameObj.User, autoPayload: "_id"},    // 除了自己更新的人
    // updObjs: [{
    //     at_upd: {type: Date},
    //     User_upd: {type: ObjectId, ref: docNameObj.User},    		// 除了自己更新的人
    // }],

	Firm: {type: ObjectId, ref: docNameObj.Firm, is_fixed: true, autoPayload: "Firm", required: true},              // 所属公司
};

/**
 * type mongodb数据库类型 
 * required [Boolean] 是否为必须填写的, 如果为 true 添加时必须要有此数据 (此字段为 mongoose 自带类型, 写入时 本系统 writePre中 也做了判定 )
 * required_min [Number] 如果字段为数组 判断是否为必须填写的, 如果有数字 数组的长度不能小于 此Number值
 * required_max [Number] 如果字段为数组 判断是否为必须填写的, 如果有数字 数组的长度不能大于 此Number值
 * is_auto [Boolean] 是否为自动更新， 如果为 true 则前端不能给数据 给数据就报错. 需要后端给数据。 要在 本身 ${Controller}文件中控制
 * autoPayload [String] 是否为自动更新时间， 如果为 _id, Firm 则前端不能给数据 给数据就报错。 writePre中 自动生成数据。 
 * 					比如 User_crt
 * is_autoDate [Boolean] 是否为自动更新时间， 如果为 true 则前端不能给数据 给数据就报错。 writePre中 自动生成数据。 
 * 					比如 at_crt 即为 autoDate 又为fixed所以只有新建时自动添加
 * is_fixed [Boolean] 字段是否可以修改, 如果为 true 则前端不可给此字段修改数据 modify中不可以更改此数据
 * // writePre 中做的判定一下几个参数
 * trimLen [Number] (所属字段必须为 String 类型) 字段的固定长度  的正整数
 * minLen [Number] (所属字段必须为 String 类型) 字段的最小长度  的正整数
 * maxLen [Number] (所属字段必须为 String 类型) 字段的最大长度  的正整数
 * regexp [正则表达式] (所属字段必须为 String 类型) 字段要符合的正则表达式
 * is_change [Boolean] 保存之前要更改数据 (如果时需要改变的 则此字段需要在 ${Controller}文件中控制 writePre会根据此字段不判定)
 * 
 * is_UnReadable [Boolean] 不可读取此数据 比如 密码  (readPre中 判定此参数)
 * 
 * unique [Boolean] 是否是唯一的, 如果为 true 则本字段中有且只有一个此值 (此字段为 mongoose 自带类型 本系统 在 docSame 中 也做了判定)
 * true_unique [Boolean] 是否是唯一的, 如果为 true 则本字段中有且只有一个为真
 * uniq [Array[其他字段]]   在docSame文件中做判定
 * true_uniq [Array[其他字段]]   在docSame文件中做判定 比如 true_uniq: ["Firm"] 一个公司中只有一个
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