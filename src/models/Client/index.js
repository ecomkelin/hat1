const {
    conn1,
    // conn2
} = require("../_connDBs");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const docName = require("../_docName");

const doc = {
    // 权限即所属信息
    is_usable: {type: Boolean, default: true},                  // 是否可用
    is_active: {type: Boolean, default: false},                 // 是否被激活验证
    vip: {type: Number},
    
    // 登录信息
    code: {type: String},                                       // <手动/自动> 管理员可添加修改，注册自动生成
    phone: {type: String},                                      // <半自动> phonePre+phoneNum
    email: {type: String},
    pwd: {type: String},

    socialObjs:[{									            // 已绑定的社交账号enum: ["facebook", "google", "wx"]
		social_type: {type: String},
		social_id: {type: String},
	}],

    // 基础信息
    name: {type: String},
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
    is_codeUpd: {type: Boolean, default: false}, 	// 只读 如果账号被修改过 则为 true 否则为 false
    at_codeUpd: {type: Date, default: null},		// 只读 上次账户修改时间

    at_crt: {type: Date},                                       // 创建时间
    User_crt_db: {type: ObjectId, ref: "User_db"},       // 创建人

    at_upd: {type: Date},                                       // 最近一次更新时间
    User_upd_dbs: [{type: ObjectId, ref: "User_db"}],    // 除了自己更新的人
    upds: [{
        at_upd: {type: Date},
        User_upd_dbs: [{type: ObjectId, ref: "User_db"}],    // 除了自己更新的人
    }],
	
    at_login: {type: Date},                                     // 最近一次登录
    City_login_db: {type: ObjectId, ref: "City_db"},     // 最近一次登录的城市
    logins: {
        at_login: {type: Date},                                     // 最近一次登录
        City_login_db: {type: ObjectId, ref: "City_db"},     // 最近一次登录的城市
    }
};

const model1 = conn1.model(docName.User, new Schema(doc));
// const model2 = conn2.model(docName.User, new Schema(doc));

module.exports = {
    model1,
    // model2,
    doc,
};