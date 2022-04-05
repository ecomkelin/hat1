const router = require('@koa/router')({prefix: '/User'});

const UserCT = require("./controller");
const UserMD = require("./middle");

router.post("/create", UserMD.create, UserCT.create);
router.post("/delete/:id", UserMD.delete, UserCT.delete);
router.post("/edit/:id", UserMD.edit, UserCT.edit);

router.post("/info/:id", UserMD.info, UserCT.info);
router.post("/list", UserMD.list, UserCT.list);

module.exports = router;