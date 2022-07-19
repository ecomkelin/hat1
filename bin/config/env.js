/**
 * 环境变量
 */
const path = require('path');

/* ======================================== 系统 ======================================== */
IS_PRD = (process.env.NODE_ENV === "production") ? true : false;
IS_DEV = (process.env.NODE_ENV === "dev") ? true : false;
IS_DEBUG = (process.env.NODE_ENV === "debug") ? true : false;

SERVER_NAME="HAT";
SERVER_PORT=8000;
if(process.env.SERVER_NAME) SERVER_NAME =process.env.SERVER_NAME;
if(process.env.SERVER_PORT) SERVER_PORT =process.env.SERVER_PORT;

DB_MASTER="mongodb://localhost/hat1";
DB_SLAVE1="mongodb://localhost/hat2";
ACCESS_TOKEN_SECRET="2195878fc68cd315b643ae9b7459689d4d1f352c91b47e382496093abfca01db99c0559823ead7ea41ca414369a737e348b9be1c253f9b193b8f09f03fcba710"
ACCESS_TOKEN_EX="30d";
REFRESH_TOKEN_SECRET="52e0be8a2ab783e1df725a778105388d2674ead419461d0f8fe13d211814e7658015bb4617824a380f01b5a7c118f8b8082e36e5035670c62541f0ea24bdd996"
REFRESH_TOKEN_EX="90d";
SALT_WORK_FACTOR=10;

if(IS_PRD) {
    DB_MASTER=process.env.DB_MASTER_PRD;
    DB_SLAVE1=process.env.DB_SLAVE1_PRD;

    ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;
    ACCESS_TOKEN_EX=process.env.ACCESS_TOKEN_EX;
    REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET;
    REFRESH_TOKEN_EX=process.env.REFRESH_TOKEN_EX;
    SALT_WORK_FACTOR=process.env.SALT_WORK_FACTOR;
} else if(IS_DEV || IS_DEBUG) {
    DB_MASTER=process.env.DB_MASTER_DEV;
    DB_SLAVE1=process.env.DB_SLAVE1_DEV;
}

IS_STRICT=false;
if(process.env.IS_STRICT === 'STRICT') IS_STRICT = true;


DIR_PUBLIC = path.resolve(process.cwd(), "public/");
DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");


/* ======================================== 数据库类型 ======================================== */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

/* ======================================== 数据库接口 ======================================== */
readDetail = {
    "match": {
        "_id": "要查找的 ObjectId",
    },
    "select": {
        "$key<field>": "$content< 1 / -1 / String > 映射"
    },

    "populate": "$content < String / Object / [Object] > 详情查看 mongoose populate" 
};

readList = {
    "paramObj": {
        "filter": {
            "search": {
                "fields": "$<String> / <[String]> 需要匹配的字段",
                "keywords": "<String> 对fields的模糊匹配 不分大小写"
            },
            "match": {
                "$key": "$value 完全匹配的值不区分大小写",
            },
            "includes": {
                "$key": "$[ObjectId] 完全匹配的数据",
            },
            "excludes": {
                "$key": "排除匹配的 $[ObjectId]",
            },
            "gte": {
                "$key": "$<Number / Float> 大于此值的 field"
            },
            "lte": {
                "$key": "$content<Number / Float> 小于此值的 field"
            },
            "at_before": {
                "$key": "$content<Date> 在此时间之前的数据"
            },
            "at_after": {
                "$key": "$content<Date> 在此时间之后的数据"
            },
        },
        "select": {
            "$key<field>": "$content< 1 / -1 / String > 映射"
        },
        "skip": "$content<Number> 跳过 Number 条数据 查找",
        "limit": "$content<Number> 查找 Number 条数据",
        "sort": {
            "$key<field>": "$content< 1 / -1> 排序"
        },
        "populate": "$content < String / Object / [Object] > 详情查看 mongoose populate" 
    }
};


/* ======================================== 常量 ======================================== */
LIMIT_FIND = 50;		// 系统中 默认调取的数据量
if(process.env.LIMIT_FIND) LIMIT_FIND =process.env.LIMIT_FIND;

PHONE_PRE = '+39';
if(process.env.PHONE_PRE) PHONE_PRE =process.env.PHONE_PRE;

MONTH = {
    1: "JAN", 2: "FEB", 3: "MAR", 4: "APR", 5: "MAY", 6: "JUN",
    7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC"
};


/* ======================================== 路由白名单 ======================================== */
WHITE_URL = [
	"/api/v1/user/init",
	"/api/authorize/user/login",
	"/api/authorize/user/refresh",
];









/* ======================================== response ======================================== */
api = (ctx, api, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, api};
}

success = (ctx, ctxBody, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
}
noAccess = (ctx) => {
    ctx.status = 401;
    ctx.body = {status: 401, message: `您没有访问 [${ctx.url}] 的权限`}
}
errs = (ctx, e, next) => {
    let error = e.stack
    let status = e.status || 500;
    ctx.status = status;

    if(error) {
        ctx.body = {status, error};
        if(status === 500) console.error("[errs] e.stack: ", error);
    } else {
        ctx.body = {status, ...e};
        if(status === 500) console.error("[errs] e: ", e);
    }
}
