const router = require('@koa/router')();



/* ============================= User Datebase ============================= */
const UserPG = require("./User/Page");
router.post("/b1/User/create", UserPG.createPG);
router.post("/b1/User/remove/:id", UserPG.removePG);
router.post("/b1/User/modify/:id", UserPG.modifyPG);


module.exports = router;