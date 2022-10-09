const router = require('@koa/router')();

const Test = require("../controllers/test")

router.get('/test', Test.test );
routerObjs.push("get - test");

module.exports = router;