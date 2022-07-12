/**
 * 环境变量
 */
const path = require('path');

IS_PRD = (process.env.NODE_ENV === "production") ? true : false;
IS_DEV = (process.env.NODE_ENV === "dev") ? true : false;

SERVER_NAME="HAT";
SERVER_PORT=8000;
if(process.env.SERVER_NAME) SERVER_NAME =process.env.SERVER_NAME;
if(process.env.SERVER_PORT) SERVER_PORT =process.env.SERVER_PORT;

DB_MASTER="mongodb://localhost/hat1";
DB_SLAVE1="mongodb://localhost/hat2";
ACCESS_TOKEN_SECRET="2195878fc68cd315b643ae9b7459689d4d1f352c91b47e382496093abfca01db99c0559823ead7ea41ca414369a737e348b9be1c253f9b193b8f09f03fcba710"
ACCESS_TOKEN_EX="5m";
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
} else if(IS_DEV) {
    DB_MASTER=process.env.DB_MASTER_DEV;
    DB_SLAVE1=process.env.DB_SLAVE1_DEV;
}

IS_STRICT=false;
if(process.env.IS_STRICT === 'STRICT') IS_STRICT = true;


DIR_PUBLIC = path.resolve(process.cwd(), "public/");
DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");

LIMIT_FIND = 50;


module.exports = {
    SERVER_NAME, SERVER_PORT,

    IS_PRD, IS_DEV,

    DB_MASTER, DB_SLAVE1,

    ACCESS_TOKEN_SECRET,ACCESS_TOKEN_EX,
    REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EX,
    SALT_WORK_FACTOR,

    DIR_PUBLIC, DIR_UPLOAD, LIMIT_FIND
}