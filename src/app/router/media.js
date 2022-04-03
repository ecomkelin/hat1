const router = require('@koa/router')({prefix: '/media'});

const CTmedia = require("../controller/media");

router.post("/upload", CTmedia.upload)

module.exports = router;