const path = require('path');
const router = require('@koa/router')();

const preCT = require(path.resolve(process.cwd(), "middle/preCT"));



/* ============================= User Datebase ============================= */
const UserCT = require("./User");
const docUser = UserCT.doc;
router.post("/b1/model/User", ctx => ctx.body= { status: 200, doc: docUser } );

router.post("/b1/User/list", preCT.find(docUser), UserCT.list);
router.post("/b1/User/detail/:id", preCT.findOne(docUser), UserCT.detail);
router.post("/b1/User/create", preCT.create(docUser), UserCT.create);
router.post("/b1/User/delete/:id", preCT.delete(docUser), UserCT.delete);
router.post("/b1/User/modify/:id", preCT.updateOne(docUser), UserCT.modify);

/* ============================= login ============================= */
const ModelUser = UserCT.Model;
const Auth = require("./");
router.post("/b1/login", Auth.login(ModelUser));
router.post("/b1/refresh", Auth.refresh(ModelUser));


module.exports = router;