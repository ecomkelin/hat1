const path = require('path');
const router = require('@koa/router')();

const docPreCT = require(path.resolve(process.cwd(), "middle/docPreCT"));
const collections = require(path.resolve(process.cwd(), "src/models/_doc/collections"));
router.post("/b1/collections", ctx => ctx.body= { status: 200, collections: Object.keys(collections) } );


/* ============================= User Datebase ============================= */
const UserCT = require("./User");
const docUser = UserCT.doc;
router.post("/b1/collection/User", ctx => ctx.body= { status: 200, doc: docUser } );

router.post("/b1/User/list", docPreCT.find(docUser), UserCT.list);
router.post("/b1/User/detail/:id", docPreCT.findOne(docUser), UserCT.detail);
router.post("/b1/User/create", docPreCT.create(docUser), UserCT.create);
router.post("/b1/User/remove/:id", docPreCT.delete(docUser), UserCT.remove);
router.post("/b1/User/modify/:id", docPreCT.updateOne(docUser), UserCT.modify);

/* ============================= login ============================= */
const ModelUser = UserCT.Model;
const Auth = require("./_auth");
router.post("/b1/login", Auth.login(ModelUser));
router.post("/b1/refresh", Auth.refresh(ModelUser));


module.exports = router;