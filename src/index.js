/**
 * @description: 总路由文件
 * @author: kelin
*/

// const prefix = "/v1";
// const router = require('@koa/router')({prefix});

const router = require('@koa/router')();
const routerObjs = [];  // 为了展示所有路由
/** ============================== 包含的其他路由 ============================== */
const JSrouter = require("./bin/js/router");

// @description: 分别展示所有数据库 document的字段
JSrouter.rtModels(router, routerObjs, 'dbModels', ['Model.js']);

// 'Api' 是读取的文件夹
JSrouter.rtApis(router, routerObjs, 'Api');

// JSrouter.rtRouters(router, routerObjs, 'particular');
/** ============================== 包含的其他路由 ============================== */


JSrouter.allModelsRouter(router, routerObjs);   // /dbs 路由 展示所有数据库 document名称

JSrouter.allConfigRouter(router, routerObjs);   // /config 路由 展示后端配置文件

router.get('/routers', ctx => ctx.body = {status: 200, routerObjs});    // /routers 路由 查看所有路由api

module.exports = router;