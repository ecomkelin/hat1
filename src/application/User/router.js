const router = require('@koa/router')({prefix: '/Users'});

const UserCT = require("./controller");
const UserMD = require("./middle");

router.post("/", UserMD.list, UserCT.list);
router.post("/detail/:id", UserMD.detail, UserCT.detail);

router.post("/add", UserMD.add, UserCT.add);
router.post("/del/:id", UserMD.del, UserCT.del);
router.post("/edit/:id", UserMD.edit, UserCT.edit);

module.exports = router;