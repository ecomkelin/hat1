const koa = require('koa');
const server = new koa();

/** 配置静态文件夹 */
const koaStatic = require('koa-static');
const DIR_PUBLIC = path.resolve(process.cwd(), "public/");
server.use(koaStatic(DIR_PUBLIC));

/** 配置可以上传文件的 koa-body 中间件可接收文件 */
const DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");
server.use(require("./middle/koaBody")(DIR_UPLOAD));

/** 日志打印中间件 */
server.use(require("./middle/log")())

/** 路由中间件 */
const router = require("./middle/router");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405


module.exports = server;