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

const rtRecu = (dirPath, routerName, n) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            if(n===0) routerName = '';
            let rs = routerName.split('/')
            for(let i=1; i<n-1; i++) {
                routerName = '/'+rs[i];
            }
            routerName += '/'+dirName;
            console.log(111, n, routerName)
            rtRecu(path.join(dirPath+dirName+'/'), routerName, n+1);
        } else {                                    // 如果是文件则 则加载
            let file = dirPath+dirName;
            if(fs.existsSync(file)) {
                let requ = require(file);
                routerName += '/'+dirName.split('.')[0];
                console.log(222, routerName);
                router.post("/b1"+routerName, requ );
            }
        }
    })
}
const viewPath = path.join(process.cwd(), "src/view/");
rtRecu(viewPath, '', 0);

const writePath = path.join(process.cwd(), "src/write/");
fs.readdirSync(writePath).forEach(dirName => {
    let dirPath = writePath+dirName;
    let file = dirPath+"/_router.js";
    if(fs.existsSync(file)) {
        let routerItem = require(file);
        router.use(routerItem.routes());
    }
})
/** ============================== 包含的其他路由 ============================== */


const COL_conf = require("./collections");
router.post("/b1/collections", ctx => ctx.body= { status: 200, collections: Object.keys(COL_conf) } );

module.exports = router;