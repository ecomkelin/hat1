# 规范
./_doc/collections.js 包含了所有的数据库集合， 所有的数据库编写好之后， 要在这注册
每个数据库集合 由两个文件组成 
	一个是 doc.js 结构文件
	另外一个是 index.js 对外文件

## doc.js 是数据库集合的结构
doc.js 文件一般会包含 公共
### ./_doc/global.js
公共集合的field， 包含了大部分的field
### 每个文件夹下的/doc_group.js 包含了 本组的公共集合
如果同时用了 global 和 group 则以group为准
### doc.js field的结构
	fieldName: {
		/* type default ref  为mongoose 系统默认值 同时required和unique也算是默认的， 只是我们也会有规则 */
		type: "类型" 			 	// 最重要的数据 一定要有。 类型: String, Number, Date, Boolean, ObjectId
		default: "",
		/* ================== 只有 type 为 Object 的数据才有以下数据 ================== */
		ref: "",
		/* ================== 只有 type 为 Object 的数据才有以下数据 ================== */

		required: true,				// 是否为必须的要写入的数据。 默认为false 如果为 true， 

		/* ================== 只有 type 为 String 的数据才有以下数据 ================== */
		minLen: 4,					// 字符串的最小长度 如果不为空的话
		maxLen: 20,					// 字符串的最大长度 如果不为空的话
		trimLen: 6, 				// 字符串的长度 如果不为空的话
		regexp: '^[a-zA-Z0-9]*$',	// 字符串的正则表达式
		/* ================== 只有 type 为 String 的数据才有以上数据 ================== */

		is_auto: true, 				// 如果为true 前端不可传输数据
		is_fixed: true,				// 如果为true 则不可修改

		unique: true,				// 表示此字段全集合唯一
		uniq: ["", ""],				// [..."Firm/User/Client..._db"]
									// 如果为 ["Firm_db"] 在相同的Firm_db值的情况下集合 此fieldName不能相同 
									// 如果为 ["Firm_db", "Brand_db"] 在相同的 Firm_db和Brand_db 全都一样的集合中 此数据唯一
	},

## index.js 加上了mongodb的方法 并暴露给外界
### ./js/mongoCommand.js
为mongodb的命令打包是被每个数据库的 index.js文件引用 并暴露出去的