/**
 * @description: 
 */

const doc_global = require("../docGlobal");
module.exports = {
	// 登录信息
    ...doc_global,
    phone: {type: String, is_auto: true},                       // <后台自动组合> phonePre+phoneNum
    email: {type: String},

    pwd: {
        type: String,
        required: true,
        minLen: 6,
        maxLen: 12,
        is_change: true, // 存储数据库之前会变化
        is_UnReadable: true, //   不可读
    },
    refreshToken: {
        type: String,
        is_auto: true,
        is_UnReadable: true
    },

    phonePre: {
        type: String,
        trimLen: 4,
        regexp: '^[0-9]*$',
        is_change: true,
    },
    phoneNum: {
        type: String,
        trimLen: 10,
        regexp: '^[0-9]*$',
    },

	addrs: [{
		city: {type: String},
		name: {type: String},
		addr: {type: String},
		postcode: {type: String},   // 邮编
		tel: {type: String},
		note: {type: String},
	}],

	// 账号登录修改信息
    is_codeUpd: {type: Boolean, default: false, is_auto: true}, 	// 只读 如果账号被修改过 则为 true 否则为 false
    at_codeUpd: {type: Date, default: null, is_auto: true},		// 只读 上次账户修改时间
    at_login: {type: Date, is_auto: true},                                     // 最近一次登录
    // site_login: {type: String, is_auto: true},                                 // 最近一次登录的地方
    // loginObjs: {
    //     at_login: {type: Date, is_auto: true},                                     
    //     site_login: {type: String, is_auto: true},                            
    // }
}