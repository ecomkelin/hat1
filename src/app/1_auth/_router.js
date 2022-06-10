const router = require('@koa/router')();

/* ============================= User Datebase ============================= */
const UserCT = require("./User");
router.post("/b1/User/list", UserCT.listPG);
router.post("/b1/User/detail/:id", UserCT.detailPG);
router.post("/b1/User/create", UserCT.createPG);
router.post("/b1/User/remove/:id", UserCT.removePG);
router.post("/b1/User/modify/:id", UserCT.modifyPG);

/* ============================= login ============================= */
const ModelUser = UserCT.Model;
const Auth = require("./_auth");
router.post("/b1/login", Auth.login(ModelUser));
router.post("/b1/refresh", Auth.refresh(ModelUser));


module.exports = router;