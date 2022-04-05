const {
    conn1,
    // conn2
} = require("../_app/conn_dbs");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const dbSchema = {
    // 权限即所属信息
    is_usable: Boolean,                             // 是否可用
    is_active: Boolean,                             // 是否被激活验证
    Firm_db: {type: ObjectId, ref: "Firm_db"},      // 所属公司
    roleNum: Number,                                // 所属部门，或者说我们可以根据这个 来决定用户的界面
    Shop_db: {type: ObjectId, ref: "Shop_db"},      // 所属分公司
    permissions: [String],                          // 用户权限

    // 登录信息
    code: String,                                   // <手动/自动> 管理员可添加修改，注册自动生成
    phone: String,                                  // <半自动> phonePre+phoneNum
    email: String,
    pwd: String,

    socialObjs:[{									// 已绑定的社交账号enum: ["facebook", "google", "wx"]
		social_type: String,
		social_id: String,
	}],

    // 基础信息
    name: String,
    phonePre: String,
    phoneNum: String,
    sortNum: Number,

    addrObjs: [{
		City_dbs : {type: ObjectId, ref: "City_db"},
		name: String,
		address: String,
		postcode: String,
		phone: String,
		note: String,
	}],

    // 创建及修改信息
    is_codeUpd: {type: Boolean, default: false}, 	// 只读 如果账号被修改过 则为 true 否则为 false
    at_codeUpd: {type: Date, default: null},		// 只读 上次账户修改时间

    at_crt: Date,                                       // 创建时间
    Firm_crt_db: {type: ObjectId, ref: "Firm_db"},       // 创建人

    at_upd: Date,                                       // 最近一次更新时间
    Firm_upd_dbs: [{type: ObjectId, ref: "Firm_db"}],    // 除了自己更新的人
    upds: [{
        at_upd: Date,
        Firm_upd_dbs: [{type: ObjectId, ref: "Firm_db"}],    // 除了自己更新的人
    }],
	
    at_login: Date,                                     // 最近一次登录
    City_login_db: {type: ObjectId, ref: "City_db"},     // 最近一次登录的城市
    logins: {
        at_login: Date,                                     // 最近一次登录
        City_login_db: {type: ObjectId, ref: "City_db"},     // 最近一次登录的城市
    }
}



const FirmDB1 = conn1.model("h1_Firm_dbs", new Schema(dbSchema));
// const FirmDB2 = conn2.model("k2_Firm_DB", new Schema(dbSchema));

module.exports = {
    dbSchema,
    FirmDB1,
    // FirmDB2
};