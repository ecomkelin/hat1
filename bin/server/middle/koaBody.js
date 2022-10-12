const koaBody = require('koa-body');
// server.use(koaBody());
/** 配置可以上传文件的 koa-body */

module.exports = (uploadDir) => koaBody({
    multipart: true,    // 打开多媒体上传
    formidable: {
        // option里的路径 不推荐使用相对路径， 因为option里的相对路径 不是当前文件的相对路径，而是当前进程 process.cwd()的相对路径。当前脚本在koa2执行
        uploadDir, // 上传的文件上传到哪个文件下 
        keepExtensions: true
    }
})


/*
const koaBody = require('koa-body');
// server.use(koaBody());
// 配置可以上传文件的 koa-body 
const DIR_UPLOAD = path.resolve(process.cwd(), "public/upload/");
server.use(koaBody({
    multipart: true,    // 打开多媒体上传
    formidable: {
        // option里的路径 不推荐使用相对路径， 因为option里的相对路径 不是当前文件的相对路径，而是当前进程 process.cwd()的相对路径。当前脚本在koa2执行
        uploadDir: DIR_UPLOAD, // 上传的文件上传到哪个文件下 
        keepExtensions: true
    }
}));
*/