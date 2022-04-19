module.exports = {
	// 登录信息
    code: {
        type: String,
        required: true,
        minLen: 4,
        maxLen: 20,
        regexp: '^[a-zA-Z0-9]*$',
        is_fixed: true,
    },                                       // <手动/自动> 管理员可添加修改，注册自动生成
    phone: {type: String, is_auto: true},                                      // <半自动> phonePre+phoneNum
    email: {type: String},

    pwd: {
        type: String,
        required: true,
        minLen: 6,
        maxLen: 12,
        as: 0
    },
    refreshToken: {
        type: String,
        is_auto: true,
        as: 0
    },

	img_url: {type: String},
    phonePre: {
        type: String,
        trimLength: 4,
        regexp: '^[0-9]*$',
    },
    phoneNum: {
        type: String,
        trimLength: 10,
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
    site_login: {type: String, is_auto: true},                                 // 最近一次登录的地方
    loginObjs: {
        at_login: {type: Date, is_auto: true},                                     
        site_login: {type: String, is_auto: true},                            
    }
}