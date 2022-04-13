const router = require('@koa/router')({prefix: '/Media'});

const MediaCT = require("./controller");

router.post("/upload", MediaCT.upload)

module.exports = router;