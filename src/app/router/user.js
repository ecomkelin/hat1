const router = require('@koa/router')({prefix: '/User'});

const UserCT = require("../controller/User");
const UserMD = require("../middle/User");

router.post("/create", UserMD.create, UserCT.create);
router.post("/delete/:id", UserCT.delete);
router.post("/edit/:id", UserCT.edit);
router.post("/delMany/:id", UserCT.delMany);

router.post("/info/:id", UserCT.info);
router.post("/list", UserCT.list);



module.exports = router;