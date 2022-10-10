const fs = require('fs');
const appPath = path.join(process.cwd(), "src/app/");

/* ======================== get /dbs 文档名称路由(展示所有文档名称) ======================== */
exports.allModelsRouter = (router) => {
    let dbs_Config = require(path.join(process.cwd(), "src/app/dbModels"));
    let url = "/dbs";
    router.get(url, ctx => ctx.body= { status: 200, dbModels: Object.keys(dbs_Config) } );
    routerObjs.push("get - " + url);
}

/* ======================== get /config 文档名称路由(展示所有文档名称) ======================== */
exports.allConfigRouter = (router) => {
    let Config = require(path.join(process.cwd(), "src/app/config"));
    let url = "/config";
    router.get(url, ctx => ctx.body = {status: 200, Config});
    routerObjs.push("get - " + url);
}


/* ====================================== get 自动加载 Model文件路由 ====================================== */
/**
 * @param {router} router 路由中间件
 * @param {*} dirPath 当前绝对路径
 * @param {*} paths 经过的所有 路径的 文件夹名称
 * @param {*} n 路径的层级
 * @param {*} maskFiles 如果false 则全部读取，  否则要为数组
 */
const getModels = (router, dirPath, paths, n, maskFiles) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let len = dirName.split('.').length;
        if(len === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n+1] = dirName;
            getModels(router, path.join(dirPath+dirName+'/'), paths, n+1, maskFiles);
        } else if(len === 2) {                                    // 如果是文件则 则加载
            if(maskFiles.includes(dirName)) {
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let requ = require(file);
                    let url = '/'+paths[0]+'/'+paths[n];
                    router.get(url, ctx => ctx.body= { status: 200, doc: requ.doc }  );
                    routerObjs.push("get - " + url)
                }
            }
        }
    });
}
exports.rtModels = (router, dirName, maskFiles) => {
    let dirPath = appPath + dirName + "/";
    getModels(router, dirPath, [dirName], 0, maskFiles);
}



/* ====================================== Post 自动加载文件路由 ====================================== */
/**
 * 
 * @param {router} router 路由中间件
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 */
 const floorLevel = 0;   // 从第几层开始输入路由路径
 const AuthMiddle = require("../../payload/authMiddle");
 const postAutos = (router, dirPath, paths, n) => {
     fs.readdirSync(dirPath).forEach(dirName => {
         let len = dirName.split('.').length;
         if(len === 1) {       // 如果是文件夹 则进一步读取内容
             paths[n+1] = dirName;   // 第number层
             postAutos(router, path.join(dirPath+dirName+'/'), paths, n+1);
         } else if(len === 2){                                    // 如果是文件则 则加载
             let file = dirPath+ dirName;
             if(fs.existsSync(file)) {
                 let requ = require(file);
                 let url = '';
                 for(let j=floorLevel; j<=n;j++) {
                     url += '/'+paths[j];
                 }
                 url += '/'+dirName.split('.')[0];
                 router.post(url, AuthMiddle, requ);
                 routerObjs.push("post - " + url);
             }
         }
     });
 }
 exports.rtAutos = (router, dirName) => {
     let dirPath = appPath + dirName + "/";
     postAutos(router, dirPath, [dirName], 0);
 }




/* ====================================== 自定义文件路由 ====================================== */
/**
 * @param {router} router 路由中间件
 * @param {*} dirPath 当前绝对路径
 */
 const getRouters = (router, dirPath) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let fns = dirName.split('.');
        if(fns.length === 1) {       // 如果是文件夹 则进一步读取内容
            getRouters(router, path.join(dirPath+dirName+'/'));
        } else if(fns.length === 3) { // 如果有两个点的文件 则加载
            if(fns[1] === "router" && fns[2] === "js") {   // 加载文件名的规则是 ***.router.js
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let r = require(file);
                    router.use(r.routes());     // 把特定路由 的 路径注册到 路由文件中
                }
            }
        }
    });
}
exports.rtRouters = (router, dirName) => {
    let dirPath = appPath + dirName + "/";
    getRouters(router, dirPath);
}


// module.exports ={
//     data: {

//     }
// }