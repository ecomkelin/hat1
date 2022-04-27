const path = require('path');
const router = require('@koa/router')();

const collections = require(path.resolve(process.cwd(), "src/models/_doc/collections"));
router.post("/b1/collections", ctx => ctx.body= { status: 200, collections: Object.keys(collections) } );


/* ============================= User Datebase ============================= */
const UserCT = require("./User");
router.post("/b1/collection/User", ctx => ctx.body= { status: 200, doc: UserCT.doc } );

router.post("/b1/User/list", UserCT.list);
router.post("/b1/User/detail/:id", UserCT.detail);
router.post("/b1/User/create", UserCT.create);
router.post("/b1/User/remove/:id", UserCT.remove);
router.post("/b1/User/modify/:id", UserCT.modify);

/* ============================= login ============================= */
const ModelUser = UserCT.Model;
const Auth = require("./_auth");
router.post("/b1/login", Auth.login(ModelUser));
router.post("/b1/refresh", Auth.refresh(ModelUser));


module.exports = router;