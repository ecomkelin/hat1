const router = require('@koa/router')();



/* ============================= login ============================= */
const UserModel = require("../../collections/0_auth/User/Model");
const Auth = require("./login");
router.post("/b1/login", Auth.login(UserModel));
router.post("/b1/refresh", Auth.refresh(UserModel));


module.exports = router;