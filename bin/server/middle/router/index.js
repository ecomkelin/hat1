/**
 * @description: 总路由文件
 * @author: kelin
*/


// const prefix = "/v1";
// const router = require('@koa/router')({prefix});

const router = require('@koa/router')();

routerObjs = [];  // 为了展示所有路由 不加const使其成为 global变量
const JSrouter = require("./method");

/** get('/dbs') 路由 展示所有数据库的 document 名称 */
JSrouter.allModelsRouter(router); 

/** get('/config') 路由 展示后端的一些配置数据 */
JSrouter.allConfigRouter(router);

/** ============================== 多路由配置  ============================== */
/** get("/dbModels/***") 获取 *** 数据库document 文档中的所有字段对象 */ 
JSrouter.rtModels(router, 'dbModels', ['Model.js']);

/** 'Auto' post("/auto/XXX/XXX") 是读取的文件夹 自动读取文件夹下的所有文件 并自动命名路由 */
JSrouter.rtAutos(router, 'auto');

/** "Api" 自定义类型 是读取的文件夹下所有的路由文件 手动添加路由器 */
JSrouter.rtRouters(router, 'api/router');
/** ============================== 多路由配置 ============================== */


router.get('/routers', ctx => resSUCCESS(ctx, {routerObjs}));    // /routers 路由 查看所有路由api

module.exports = router;