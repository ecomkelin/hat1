const router = require('@koa/router')();
const userModel = require(path.resolve(process.cwd(), "src/app/dbModels/1_person/User/Model"));

const authLogin = require("../controllers/0_authLogin")
router.post('/api/user/refresh', authLogin.refresh(userModel));
router.post('/api/user/login', authLogin.login(userModel));
// routerObjs.push("get - test");

module.exports = router;