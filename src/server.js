const {DB_SERVER, DIR_PUBLIC, DIR_UPLOAD} = require("./config/const_sys");

const Koa = require('koa');
const server = new Koa();

// 链接数据库
const mongoose = require('mongoose');

mongoose.connect(DB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true});

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
}))

// const routerUser = require('./router/user');
// server.use(routerUser.routes());
const router = require("./app/router/_config.js");
server.use(router.routes());
server.use(router.allowedMethods()); // 比如 register 用了 get 则报 405

module.exports = server;