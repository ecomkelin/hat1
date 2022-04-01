const router = require('@koa/router')({prefix: '/b1/user'});

const CTuser = require("../controller/user");
const VFuser = require("../middle/user");

router.post("/register", VFuser.register, CTuser.register);
router.post("/login", CTuser.login);
router.post("/list", CTuser.list);
router.post("/profile", CTuser.profile);

router.post("/avatar", CTuser.avatar)

module.exports = router;