const router = require('@koa/router')();

const collections = require("./collections");
router.post("/b1/collections", ctx => ctx.body= { status: 200, collections: Object.keys(collections) } );


/* ============================= User Datebase ============================= */
const UserDB = require("../1_auth/User/UserDB");
router.post("/b1/collection/User", ctx => ctx.body= { status: 200, doc: UserDB.doc } );	// 暴露给开发人员 User集合 的字段 field


module.exports = router;