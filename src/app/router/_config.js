const fs = require('fs');

const router = require('@koa/router')();

fs.readdirSync(__dirname).forEach(file => {
    // console.log(file);
    if(file !== "_config.js") {
        let r = require("./"+file);
        router.use(r.routes());
    }
})

module.exports = router;