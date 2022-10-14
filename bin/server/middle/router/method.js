/* =============================================== 中间件 =============================================== */
const jwtMD = require(path.join(process.cwd(), "core/encryption/jwt"));
/**
 * 权限中间件
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns [Function] next() | resNOACCESS(ctx)
 */
const AuthMiddle = async(ctx, next) => {
	try {
		/** 如果是查看 api 则一律通过 */
		if(ctx.request.query.api == 1) return next();

		/** 白名单一律通过 */
		ctx.url = ctx.url.toLowerCase();
		if(WHITE_URL.includes(ctx.url)) return next();

		/** 根据headers 获取payload */
		let payload = await jwtMD.obtainPayload_Pobj(ctx.request.headers['authorization']);
		ctx.request.payload = payload;

		/** 根据 type_auth 分批管理 */
		if(payload.type_auth === 'User') {
			/** 如果是超级管理员 则一律通过 */
			if(payload.is_admin) return next();
			if(payload.auths && payload.auths.includes(ctx.url)) return next();
		}

		/** 没有通过的情况下 一律阻止 */
		return resNOACCESS(ctx);
		// return next();
	} catch(e) {
		return resERR(ctx, e, next);
	}
}
/* =============================================== 中间件 =============================================== */











const fs = require('fs');
const appPath = path.join(process.cwd(), "src/app/");

/* ======================== get /dbs 文档名称路由(展示所有文档名称) ======================== */
exports.allModelsRouter = (router) => {
    let dbs_Config = require(path.join(process.cwd(), "src/app/dbModels"));
    let url = "/dbModels";
    router.get(url, ctx => resSUCCESS(ctx,{ dbModels: Object.keys(dbs_Config) } ));
    routerObjs.push("get - " + url);
}

/* ======================== get /config 文档名称路由(展示所有文档名称) ======================== */
exports.allConfigRouter = (router) => {
    let Config = require(path.join(process.cwd(), "src/app/config"));
    let url = "/config";
    router.get(url, ctx => resSUCCESS(ctx, {Config}));
    routerObjs.push("get - " + url);
}


/* ====================================== get 自动加载 Model文件路由 ====================================== */
/**
 * @param {Router} router 路由中间件
 * @param {String} dirPath 当前绝对路径
 * @param {Array} paths Array[String] 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 * @param {Array} inFiles 如果false 则全部读取，  否则要为数组
 */
const getModels = (router, dirPath, paths, n, inFiles) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let len = dirName.split('.').length;
        if(len === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n+1] = dirName;
            getModels(router, path.join(dirPath+dirName+'/'), paths, n+1, inFiles);
        } else if(len === 2) {                                    // 如果是文件则 则加载
            if(inFiles.includes(dirName)) {
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let requ = require(file);
                    let url = '/'+paths[0]+'/'+paths[n];
                    router.get(url, ctx => resSUCCESS(ctx, { docModel: requ.docModel } ) );
                    routerObjs.push("get - " + url)
                }
            }
        }
    });
}
/**
 * 
 * @param {Router} router 
 * @param {String} dirName 根目录
 * @param {Array} inFiles 根目录下 只要名字为此的文件都包含
 */
exports.rtModels = (router, dirName, inFiles) => {
    let dirPath = appPath + dirName + "/";
    getModels(router, dirPath, [dirName], 0, inFiles);
}



/* ====================================== Post 自动加载文件路由 ====================================== */
/**
 * 
 * @param {Router} router 路由中间件
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 */
 const floorLevel = 0;   // 从第几层开始输入路由路径

 const postAutos = (router, dirPath, paths, n) => {
     fs.readdirSync(dirPath).forEach(dirName => {
         let len = dirName.split('.').length;
         if(len === 1) {       // 如果是文件夹 则进一步读取内容
             paths[n+1] = dirName;   // 第number层
             postAutos(router, path.join(dirPath+dirName+'/'), paths, n+1);
         } else if(len === 2){                                    // 如果是文件则 则加载
             let file = dirPath+ dirName;
             if(fs.existsSync(file)) {
                 let requ = require(file);  // 加载每个文件
                 let url = '';
                 for(let j=floorLevel; j<=n;j++) {
                     url += '/'+paths[j];
                 }
                 url += '/'+dirName.split('.')[0];
                 router.post(url, AuthMiddle, requ);
                 routerObjs.push("post - " + url);
             }
             // 也就是说 如果 是 XXX.XXX.js 则不加载
         }
     });
 }
 exports.rtAutos = (router, dirName) => {
     let dirPath = appPath + dirName + "/";
     postAutos(router, dirPath, [dirName], 0);
 }




/* ====================================== 自定义文件路由 ====================================== */
/**
 * @param {Router} router 路由中间件
 * @param {String} dirPath 当前绝对路径
 */
 const getRouters = (router, dirPath) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let fns = dirName.split('.');
        if(fns.length === 1) {       // 如果是文件夹 则进一步读取内容
            getRouters(router, path.join(dirPath+dirName+'/'));
        } else if(fns.length === 3) { // 如果有两个点的文件 则加载
            if(fns[1] === "router" && fns[2] === "js") {   // 文件名的规则是 ***.router.js
                let file = dirPath+ dirName;    // 加载相应文件
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