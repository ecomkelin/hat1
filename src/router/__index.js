const router = require('@koa/router')();
// const router = require('@koa/router')({prefix: "/v1"});

/** ============================== 包含的其他路由 ============================== */
const fs = require('fs');
const path = require('path');

const collectionPath = path.join(process.cwd(), "src/collections/");
fs.readdirSync(collectionPath).forEach(dirName => {
    let dirPath = collectionPath+dirName;
    let file = dirPath+"/_router.js";
    if(fs.existsSync(file)) {
        let routerItem = require(file);
        router.use(routerItem.routes());
    }
})
const pagePath = path.join(process.cwd(), "src/pages/");
fs.readdirSync(pagePath).forEach(dirName => {
    let dirPath = pagePath+dirName;
    let file = dirPath+"/_router.js";
    if(fs.existsSync(file)) {
        let routerItem = require(file);
        router.use(routerItem.routes());
    }
})
/** ============================== 包含的其他路由 ============================== */


const COL_conf = require("../collections/config");
router.post("/b1/collections", ctx => ctx.body= { status: 200, collections: Object.keys(COL_conf) } );

module.exports = router;