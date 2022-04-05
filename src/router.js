const fs = require('fs');
const path = require('path');

const rPath = path.join(process.cwd(), "src/application/");

const router = require('@koa/router')({prefix: "/b1"});

fs.readdirSync(rPath).forEach(dirName => {
    const file = rPath+dirName+"/router.js";
    if(fs.existsSync(file)) {
        let r = require(file);
        router.use(r.routes());
    }
})

module.exports = router;