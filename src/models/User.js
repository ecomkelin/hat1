const {
    conn1,
    // conn2
} = require("./_connDBs");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = {
    // 权限即所属信息
    is_usable: {type: Boolean, default: true},                  // 是否可用
    Firm_db: {type: ObjectId, ref: "Firm_db"},                  // 所属公司
    roleNum: {type: Number},                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    Shop_db: {type: ObjectId, ref: "Shop_db"},                  // 所属分公司
    permissions: [{type: String}],                              // 用户权限

    // 登录信息
    code: {type: String},                                       // <手动/自动> 管理员可添加修改，注册自动生成
    phone: {type: String},                                      // <半自动> phonePre+phoneNum
    email: {type: String},
    pwd: {type: String},

    // 基础信息
    name: {type: String},
    img_url: {type: String},
    phonePre: {type: String},
    phoneNum: {type: String},
    sortNum: {type: Number},

    addrObjs: [{
		City_dbs : {type: ObjectId, ref: "City_db"},
		name: {type: String},
		address: {type: String},
		postcode: {type: String},
		phone: {type: String},
		note: {type: String},
	}],

    // 创建及修改信息
    at_crt: {type: Date},                                       // 创建时间
    User_crt_db: {type: ObjectId, ref: "User_db"},       // 创建人

    at_upd: {type: Date},                                       // 最近一次更新时间
    User_upd_db: {type: ObjectId, ref: "User_db"},    // 除了自己更新的人
    updObjs: [{
        at_upd: {type: Date},
        User_upd_db: {type: ObjectId, ref: "User_db"},    // 除了自己更新的人
    }],
	
    // 账号登录修改信息
    is_codeUpd: {type: Boolean, default: false}, 	// 只读 如果账号被修改过 则为 true 否则为 false
    at_codeUpd: {type: Date, default: null},		// 只读 上次账户修改时间
    at_login: {type: Date},                                     // 最近一次登录
    site_login: {type: String},                                 // 最近一次登录的地方
    loginObjs: {
        at_login: {type: Date},                                     
        site_login: {type: String},                            
    }
}
const UserDB1 = conn1.model("h1_User_dbs", new Schema(UserSchema));
// const UserDB2 = conn2.model("k2_User_DB", new Schema(UserSchema));





const restrict_User = {
	code: {required: true,min: 4, max: 20, regexp: '^[a-zA-Z0-9]*$', errMsg: {
		nullMsg: '成员账号不能为空',
		regexpMsg: '成员账号只能由数字和字母组成',
		minMsg: '成员账号的位数不能小于: ',
		maxMsg: '成员账号的位数不能大于: '
	}},

	pwd: {required: true, min: 6, max: 12, errMsg: {
		nullMsg: '密码不能为空',
		minMsg: '密码的位数不能小于: ',
		maxMsg: '密码的位数不能大于: '
	}},

	name: {regexp: '^[a-zA-Z0-9]*$', min: 4, max: 20, errMsg: {
		regexpMsg: '成员姓名只能由数字和字母组成',
		minMsg: '成员姓名的位数不能小于: ',
		maxMsg: '成员姓名的位数不能大于: '
	}},

	phonePre: {trim: 4, regexp: '^[0-9]*$', errMsg: {
		regexpMsg: '电话号码前缀只能由数字组成',
		trimMsg: '电话号码前缀长度只能为: ',
	}},
	phoneNum: {trim: 10, regexp: '^[0-9]*$', errMsg: {
		regexpMsg: '电话号码只能由数字组成',
		trimMsg: '电话号码的长度只能为: ',
	}},
};


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

module.exports = {
    UserDB1,
    // UserDB2,
    UserSchema,
    restrict_User,
    listParam_User
};