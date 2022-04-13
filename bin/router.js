const fs = require('fs');
const path = require('path');
const router = require('@koa/router')();
// const router = require('@koa/router')({prefix: "/v1"});

const routerPath = path.join(process.cwd(), "src/app/");

fs.readdirSync(routerPath).forEach(dirName => {
    const file = routerPath+dirName+"/_router.js";
    if(fs.existsSync(file)) {
        let routerItem = require(file);
        router.use(routerItem.routes());
    }
})

module.exports = router;