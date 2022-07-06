const router = require('@koa/router')();
// const router = require('@koa/router')({prefix: "/v1"});

/** ============================== 包含的其他路由 ============================== */
const routerObjs = [];
const version = '/v1';

const fs = require('fs');
const path = require('path');
const payloadMD = require("./bin/payload");
/**
 * 
 * @param {*} dirPath 当前绝对路径
 * @param {*} paths 经过的所有 路径的 文件夹名称
 * @param {*} n 路径的层级
 * @param {*} maskFiles 如果false 则全部读取，  否则要为数组
 */
const prefixModel = 'Models';
const rtRecuModel = (dirPath, paths, n, maskFiles) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n] = dirName;
            rtRecuModel(path.join(dirPath+dirName+'/'), paths, n+1, maskFiles);
        } else {                                    // 如果是文件则 则加载
            if(maskFiles.includes(dirName)) {
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let requ = require(file);
                    let routerName = version+'/'+prefixModel+'/'+paths[n-1];
                    router.get(routerName, ctx => ctx.body= { status: 200, doc: requ.doc }  );
                    routerObjs.push(routerName)
                }
            }
        }
    });
}

// 读取所有Model
const collectionPath = path.join(process.cwd(), "src/app/models/");
rtRecuModel(collectionPath, ['models'], 0, ['Model.js']);


const floor = {
    first: 0,
    second: 1,
};
/**
 * 
 * @param {*} dirPath 当前绝对路径
 * @param {*} paths 经过的所有 路径的 文件夹名称
 * @param {*} floorLevel 从第几层开始输入路由路径
 * @param {*} n 路径的层级
 */
const rtRecu = (dirPath, paths, floorLevel, n) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n] = dirName;
            rtRecu(path.join(dirPath+dirName+'/'), paths, floorLevel, n+1);
        } else {                                    // 如果是文件则 则加载
            let file = dirPath+ dirName;
            if(fs.existsSync(file)) {
                let requ = require(file);
                let routerName = version;
                for(let j=floorLevel; j<n;j++) {
                    routerName += '/'+paths[j];
                }
                routerName += '/'+dirName.split('.')[0];
                router.post(routerName, payloadMD, requ);
                routerObjs.push(routerName);
            }
        }
    });
}
const PagePath = path.join(process.cwd(), "src/app/Page/");
rtRecu(PagePath, ['Page'], floor.second, 0);

const PostPath = path.join(process.cwd(), "src/app/Post/");
rtRecu(PostPath, ['Post'], floor.second, 0);

const AuthPath = path.join(process.cwd(), "src/app/Auth/");
rtRecu(AuthPath, ['Auth'], floor.first, 0);
/** ============================== 包含的其他路由 ============================== */






const COL_conf = require("./app/models");
const colsRouter = version+"/allDBs"
router.get(colsRouter, ctx => ctx.body= { status: 200, models: Object.keys(COL_conf) } );
routerObjs.push(colsRouter);

const Config = require("./app/config");
const confRouter = version+"/config";
router.get(confRouter, ctx => ctx.body = {status: 200, Config});
routerObjs.push(confRouter);

router.get(version+'/routers', ctx => ctx.body = {status: 200, routerObjs});

module.exports = router;