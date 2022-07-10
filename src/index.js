/**
 * 路由控制文件
 */

const router = require('@koa/router')();
// const prefix = "/v1";
// const router = require('@koa/router')({prefix});
const routerObjs = [];

/** ============================== 包含的其他路由 ============================== */
const JSrouter = require("./bin/js/router");

// ---- 读取所有Model
/**
 * 'Models' 是读取的文件夹
 * ['Model.js'] 子文件夹下的文件 如果没有 则全读
 */
JSrouter.rtModels(router, routerObjs, 'Models', ['Model.js']);

// ---- 页面路由
/**
 * 'Api' 是读取的文件夹
 */
JSrouter.rtRouters(router, routerObjs, 'Api');
// const PostPath = appPath+"Post/";
// rtRouters(PostPath, ['Post'], floor.second);
/** ============================== 包含的其他路由 ============================== */


// -- 读取所有models
const COL_conf = require("./app/Models");
const colsRouter = "/dbs"
router.get(colsRouter, ctx => ctx.body= { status: 200, Models: Object.keys(COL_conf) } );
routerObjs.push(colsRouter);

// -- 读取config文件
const Config = require("./app/config");
const confRouter = "/config";
router.get(confRouter, ctx => ctx.body = {status: 200, Config});
routerObjs.push(confRouter);

// -- 设置routers api 方便查询所有路由
router.get('/routers', ctx => ctx.body = {status: 200, routerObjs});

module.exports = router;