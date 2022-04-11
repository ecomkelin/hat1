const {
    conn1,
    // conn2
} = require("../connDBs");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const docName = require("../docName");

const doc = {
    // _id: {type: ObjectId, is_auto: true},
    // 权限即所属信息
    is_usable: {type: Boolean, default: true},                  // 是否可用
    Firm_db: {type: ObjectId, ref: docName.Firm},              // 所属公司
    roleNum: {type: Number},                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    Shop_db: {type: ObjectId, ref: docName.Shop},              // 所属分公司
    auths: [{type: String}],                                    // 用户权限

    // 登录信息
    code: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        regexp: '^[a-zA-Z0-9]*$',
        regErrMsg: "只能为数字或字符",
        is_fixed: true,
    },                                       // <手动/自动> 管理员可添加修改，注册自动生成
    phone: {type: String, is_auto: true},                                      // <半自动> phonePre+phoneNum
    email: {type: String},
    pwd: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 12,
        select: 0,
    },

    // 基础信息
    name: {
        type: String,
        minLength: 4,
        maxLength: 20,
        regexp: '^[a-zA-Z0-9]*$',
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
    sortNum: {type: Number},

    addrObjs: [{
		City_dbs : {type: ObjectId, ref: docName.City},
		name: {type: String},
		addr: {type: String},
		postcode: {type: String},
		phone: {type: String},
		note: {type: String},
	}],

    // 创建及修改信息
    at_crt: {type: Date},                                       // 创建时间
    User_crt_db: {type: ObjectId, ref: docName.User},       // 创建人

    at_upd: {type: Date},                                       // 最近一次更新时间
    User_upd_db: {type: ObjectId, ref: docName.User},    // 除了自己更新的人
    updObjs: [{
        at_upd: {type: Date},
        User_upd_db: {type: ObjectId, ref: docName.User},    // 除了自己更新的人
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
};

const model1 = conn1.model(docName.User, new Schema(doc));
// const model2 = conn2.model(docName.User, new Schema(doc));

module.exports = {
    model1,
    // model2,
    doc,
};