/**
 * @description: 
 */

const doc_global = require("../docGlobal");
module.exports = {
	// 登录信息
    ...doc_global,

    phone: {type: String, is_auto: true},     // <半自动> phonePre+phoneNum
    email: {type: String},

    pwd: {
        type: String,
        required: true,
        minLen: 6,
        maxLen: 12,
        saveChange: true, // 存储数据库之前会变化
        is_hideRead: true, //   不可读
    },
    refreshToken: {
        type: String,
        is_auto: true,
        is_hideRead: true
    },

	img_url: {type: String},
    phonePre: {
        type: String,
        trimLen: 4,
        regexp: '^[0-9]*$',
        saveChange: true,
    },
    phoneNum: {
        type: String,
        trimLen: 10,
        regexp: '^[0-9]*$',
    },

	addrObjs: [{
		City_dbs : {type: String},
		name: {type: String},
		addr: {type: String},
		postcode: {type: String},
		phone: {type: String},
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