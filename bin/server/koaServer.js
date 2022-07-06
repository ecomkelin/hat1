const {DIR_PUBLIC, DIR_UPLOAD} = require("./_sysConf");

const koa = require('koa');
const server = new koa();

const koaStatic = require('koa-static');
server.use(koaStatic(DIR_PUBLIC));

const koaBody = require('koa-body');
// server.use(koaBody());
server.use(koaBody({// 配置可以上传文件的 koa-body
    multipart: true,    // 打开多媒体上传
    formidable: {
        // option里的路径 不推荐使用相对路径， 因为option里的相对路径 不是当前文件的相对路径，而是当前进程 process.cwd()的相对路径。当前脚本在koa2执行
        uploadDir: DIR_UPLOAD, // 上传的文件上传到哪个文件下 
        keepExtensions: true
    }
}));

// 日志打印中间件
const moment = require('moment');
server.use(async(ctx, next) => {
    let start = Date.now();
    console.log(moment(start).format("YYYY-MM-DD HH:mm:ss"), ` ---------- ${ctx.method} ${ctx.url}`);
    // if(ctx && ctx.request) console.debug("req body: ", ctx.request.body);
    // if(ctx.request.headers) console.debug(ctx.request.headers.authorization)
    await next();

    // if(ctx) console.debug("res body", ctx.body);
    let end = Date.now();
    let ms = end - start;
    console.log('用时:', `${ms}ms`);
    console.log();
    return;
})

// const routerUser = require('./router/User');
// server.use(routerUser.routes());
const router = require("../../src");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405


module.exports = server;