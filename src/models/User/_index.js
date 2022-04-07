module.exports = {
    // 权限即所属信息
    is_usable: {
		schema: {type: Boolean, default: true},
		typeMatch: 'Boolean',
		listParam: ['match', 'unMatch', 'search', ],
	},
    Firm_db: {
		schema: {type: ObjectId, ref: "h1_Firm_dbs"},              // 所属公司
		typeMatch: 'ObjectId',
		is_fixed: true,
	},
    roleNum: {   // 所属部门，或者说我们可以根据这个 来决定用户的界面
		schema: {type: Number}, 
		typeMatch: 'Number',
	},
    Shop_db: {
		schema: {type: ObjectId, ref: "h1_Shop_dbs"},              // 所属分公司
		typeMatch: 'ObjectId',
	},
    auths: {
		schema: [{type: String}],                                    // 用户权限
		typeMatch: '[String]'
	},

    // 登录信息
    code: {
		schema: {type: String},
		typeMatch: 'String',
		restrict: {required: true, min: 4, max: 20, regexp: '^[a-zA-Z0-9]*$', errMsg: {
			nullMsg: '成员账号不能为空',
			regexpMsg: '成员账号只能由数字和字母组成',
			minMsg: '成员账号的位数不能小于: ',
			maxMsg: '成员账号的位数不能大于: '
		}},
	},
    phone: {
		schema: {type: String},                                      // <半自动> phonePre+phoneNum
		typeMatch: 'String',
		is_auto: true,
	},
    email: {
		schema: {type: String},
		typeMatch: 'String',
	},
    pwd: {
		schema: {type: String},
		typeMatch: 'String',
		restrict: {required: true, min: 6, max: 12, errMsg: {
			nullMsg: '密码不能为空',
			minMsg: '密码的位数不能小于: ',
			maxMsg: '密码的位数不能大于: '
		}},
	},
    // 基础信息
    name: {
		schema: {type: String},
		typeMatch: 'String',
		restrict: {regexp: '^[a-zA-Z0-9]*$', min: 4, max: 20, errMsg: {
			regexpMsg: '成员姓名只能由数字和字母组成',
			minMsg: '成员姓名的位数不能小于: ',
			maxMsg: '成员姓名的位数不能大于: '
		}},
	},
    img_url: {
		schema: {type: String},
		typeMatch: 'file',
	},
    phonePre: {
		schema: {type: String},
		typeMatch: 'String',
		restrict: {trim: 4, regexp: '^[0-9]*$', errMsg: {
			regexpMsg: '电话号码前缀只能由数字组成',
			trimMsg: '电话号码前缀长度只能为: ',
		}},
	},
    phoneNum: {
		schema: {type: String},
		typeMatch: 'String',
		restrict: {trim: 10, regexp: '^[0-9]*$', errMsg: {
			regexpMsg: '电话号码只能由数字组成',
			trimMsg: '电话号码的长度只能为: ',
		}},
	},
    sortNum: {
		schema: {type: Number},
		typeMatch: 'Number', 
	},

    addrObjs: {
		schema: [{
			City_dbs : {type: ObjectId, ref: "h1_City_dbs"},
			name: {type: String},
			addr: {type: String},
			postcode: {type: String},
			phone: {type: String},
			note: {type: String},
		}],
		typeMatch: '[object]'
	},

    // 创建及修改信息
    at_crt: {
		schema: {type: Date},                                       // 创建时间
		typeMatch: 'Date',
		is_auto: true,
	},
    User_crt_db: {
		schema: {type: ObjectId, ref: "h1_User_dbs"},       // 创建人
		typeMatch: 'ObjectId',
		is_auto: true,
	},

    at_upd: {
		schema: {type: Date},                                       // 最近一次更新时间
		typeMatch: 'Date',
		is_auto: true,
	},
    User_upd_db: {
		schema: {type: ObjectId, ref: "h1_User_dbs"},    // 除了自己更新的人
		typeMatch: 'ObjectId',
		is_auto: true,
	},
    // updObjs: [{
    //     at_upd: {type: Date},
    //     User_upd_db: {type: ObjectId, ref: "h1_User_dbs"},    // 除了自己更新的人
    // }],
	
    // // 账号登录修改信息
    // is_codeUpd: {type: Boolean, default: false}, 	// 只读 如果账号被修改过 则为 true 否则为 false
    // at_codeUpd: {type: Date, default: null},		// 只读 上次账户修改时间
    // at_login: {type: Date},                                     // 最近一次登录
    // site_login: {type: String},                                 // 最近一次登录的地方
    // loginObjs: {
    //     at_login: {type: Date},                                     
    //     site_login: {type: String},                            
    // }
}


const listParam_User = {
    filter: {
        match: { // 精确筛选 String Number
            is_usable: {type: Boolean},
            roleNum: {type: Number},

            code: {type: String},
            phone: {type: String},
            email: {type: String},
            name: {type: String},
            is_codeUpd: {type: Boolean},
        },
        unMatch: {

        },

        search: {   // 模糊匹配
            fields: [String],
            keyword: String,
        },

        include: {  // ObjectId
            _id: {type: ObjectId},
            Firm_db: {type: ObjectId},
            Shop_db: {type: ObjectId},
            User_crt_db: {type: ObjectId},
            User_upd_db: {type: ObjectId},
        },
        includes: {
            _ids: [{type: ObjectId}],
        },
        excludes: { },

        at_before: {    // Date
            at_codeUpd: {type: Date},
            at_crt: {type: Date},
            at_upd: {type: Date},
            at_login: {type: Date},
        },
        at_after: {
        },
        gte: {  // Number
            sortNum: {type: Number},
        },
        lte: {},
    },
    select: {
        code: 1,
    },
    skip: Number,
    limit: Number,
    sort: {
        sort: {type: Number},  // [Enum: 1 / -1 ]
        roleNum: {type: Number},  // [Enum: 1 / -1 ]
        Shop_db: {type: Number},  // [Enum: 1 / -1 ]
        code: {type: Number},  // [Enum: 1 / -1 ]
        phone: {type: Number},  // [Enum: 1 / -1 ]
        email: {type: Number},  // [Enum: 1 / -1 ]
    },
    populate: [{
        path: {type: String},
        select: {type: String},
        option: {
            limit: {type: Number},
            skip: {type: Number},
            sort: {

            }
        },
        // populate: [{...  }]
    }],
};