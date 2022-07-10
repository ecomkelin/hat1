const fs = require('fs');
const path = require('path');
const appPath = path.join(process.cwd(), "src/app/");


/* ====================================== 普通功能路由 ====================================== */
/**
 * 
 * @param {router} router 路由中间件
 * @param {Array} routerObjs 通过api展示给使用者所有的路由
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} floorLevel 从第几层开始输入路由路径
 * @param {Number} n 路径的层级
 */
const payloadMD = require("../../payload");
const postRouters = (router, routerObjs, dirPath, paths, n) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n+1] = dirName;
            postRouters(router, routerObjs, path.join(dirPath+dirName+'/'), paths, n+1);
        } else {                                    // 如果是文件则 则加载
            let file = dirPath+ dirName;
            if(fs.existsSync(file)) {
                let requ = require(file);
                let routerName = '';
                for(let j=0; j<=n;j++) {
                    routerName += '/'+paths[j];
                }
                routerName += '/'+dirName.split('.')[0];
                router.post(routerName, payloadMD, requ);
                routerObjs.push(routerName);
            }
        }
    });
}
const rtRouters = (router, routerObjs, dirName) => {
    let dirPath = appPath + dirName + "/";
    postRouters(router, routerObjs, dirPath, [dirName], 0);
}


/* ====================================== Model文件路由 ====================================== */
/**
 * @param {router} router 路由中间件
 * @param {Array} routerObjs 通过api展示给使用者所有的路由
 * @param {*} dirPath 当前绝对路径
 * @param {*} paths 经过的所有 路径的 文件夹名称
 * @param {*} n 路径的层级
 * @param {*} maskFiles 如果false 则全部读取，  否则要为数组
 */

const getModels = (router, routerObjs, dirPath, paths, n, maskFiles) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n+1] = dirName;
            getModels(router, routerObjs, path.join(dirPath+dirName+'/'), paths, n+1, maskFiles);
        } else {                                    // 如果是文件则 则加载
            if(maskFiles.includes(dirName)) {
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let requ = require(file);
                    let routerName = '/'+paths[0]+'/'+paths[n];
                    router.get(routerName, ctx => ctx.body= { status: 200, doc: requ.doc }  );
                    routerObjs.push(routerName)
                }
            }
        }
    });
}
const rtModels = (router, routerObjs, dirName, maskFiles) => {
    let dirPath = appPath + dirName + "/";
    getModels(router, routerObjs, dirPath, [dirName], 0, maskFiles);
}

module.exports ={
    rtRouters,
    rtModels
}