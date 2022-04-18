const path = require('path');
const router = require('@koa/router')();

const preCT = require(path.resolve(process.cwd(), "middle/preCT"));

/* ============================= login ============================= */
const Auth = require("./");
router.post("/b1/login", Auth.login('b1'));
router.post("/b1/refresh", Auth.refresh('b1'));

/* ============================= User Datebase ============================= */
const docUser = require(path.resolve(process.cwd(), "src/models/1_auth/User/doc"));
router.post("/b1/model/User", ctx => ctx.body= { status: 200, doc: docUser } );

const UserCT = require("./User");
router.post("/b1/User/list", preCT.find(docUser), UserCT.list);
router.post("/b1/User/detail/:id", preCT.findOne(docUser), UserCT.detail);
router.post("/b1/User/create", preCT.create(docUser), UserCT.create);
router.post("/b1/User/delete/:id", preCT.delete(docUser), UserCT.delete);
router.post("/b1/User/modify/:id", preCT.updateOne(docUser), UserCT.modify);

module.exports = router;