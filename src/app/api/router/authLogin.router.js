const router = require('@koa/router')();

/** 用户 登录 或 refresh */
const authLogin = require("../controllers/0_authLogin");

/** User auth */
const userModel = require(path.resolve(process.cwd(), "src/app/dbModels/1_person/User/Model"));
router.post('/api/user/login', authLogin.login(userModel));
router.post('/api/user/refresh', authLogin.refresh(userModel));
routerObjs.push("post - /api/user/login");
routerObjs.push("post - /api/user/refresh");

module.exports = router;