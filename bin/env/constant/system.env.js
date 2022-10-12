/* ======================================== 系统 ======================================== */
/** 运行环境 */
IS_PRD = (process.env.NODE_ENV === "production") ? true : false;
IS_DEV = (process.env.NODE_ENV === "dev") ? true : false;
IS_DEBUG = (process.env.NODE_ENV === "debug") ? true : false;
if (IS_PRD) {
    console.log = () => { };
    console.debug = () => { };
} else if (IS_DEV) {
    console.debug = () => { };
}

/** 系统名称 端口 */
SERVER_NAME = process.env.SERVER_NAME || "HAT";
SERVER_PORT = parseInt(process.env.SERVER_PORT) || 8000;

/** 数据库名称 */
DB_MASTER = process.env.DB_MASTER || "mongodb://localhost/hat1";
DB_SLAVE1 = process.env.DB_SLAVE1 || "mongodb://localhost/hat2";

/** token */
ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "2195878fc68cd315b643ae9b7459689d4d1f352c91b47e382496093abfca01db99c0559823ead7ea41ca414369a737e348b9be1c253f9b193b8f09f03fcba710"
ACCESS_TOKEN_EX = process.env.ACCESS_TOKEN_EX || "30d";
REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "52e0be8a2ab783e1df725a778105388d2674ead419461d0f8fe13d211814e7658015bb4617824a380f01b5a7c118f8b8082e36e5035670c62541f0ea24bdd996"
REFRESH_TOKEN_EX = process.env.REFRESH_TOKEN_EX || "90d";
SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR) || 10;

/** 是否为严格模式 */
IS_STRICT = (process.env.IS_STRICT == 'true') ? true : false;