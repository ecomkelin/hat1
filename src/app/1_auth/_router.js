const path = require('path');
const router = require('@koa/router')();

const preCT = require(path.resolve(process.cwd(), "middle/preCT"));

/* ============================= login ============================= */
const Auth = require("./auth");
router.post("/b1/login", Auth.login('b1'));
router.post("/b1/refresh", Auth.refresh('b1'));

/* ============================= User Datebase ============================= */
const UserDB = require(path.resolve(process.cwd(), "src/models/User"));

const UserCT = require("./User");
router.post("/b1/User/list", preCT.find(UserDB.doc), UserCT.list);
router.post("/b1/User/detail/:id", preCT.findOne(UserDB.doc), UserCT.detail);
router.post("/b1/User/create", preCT.create(UserDB.doc), UserCT.create);
router.post("/b1/User/delete/:id", preCT.delete(UserDB.doc), UserCT.delete);
router.post("/b1/User/modify/:id", preCT.updateOne(UserDB.doc), UserCT.modify);



module.exports = router;