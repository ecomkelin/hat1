const moment = require('moment');

exports.all = async(ctx, ctxBody) => {
    console.log("--------------------- all ---------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    const {position, message} = ctxBody;
    if(position) console.log("[@/resJson success] position: ", position);
    if(message) console.log("[@/resJson success] message: ", message);
    console.log();
    ctx.status = ctxBody.status;
    ctx.body = {...ctxBody};
    return;
}
exports.success = async(ctx, ctxBody) => {
    console.log("----------------- success -----------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    const {position, message} = ctxBody;
    if(position) console.log("[@/resJson success] position: ", position);
    if(message) console.log("[@/resJson success] message: ", message);
    console.log();
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
    return;
}
exports.failure = async(ctx, ctxBody) => {
    console.log("----------------- failure -----------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    const {position, message} = ctxBody;
    
    if(position) console.log("[@/resJson failure] position: ", position);
    if(message) console.log("[@/resJson failure] message: ", message);
    console.log();
    
    ctx.status = 400;
    ctx.body = {status: 400, ...ctxBody};
    return;
}

exports.errs = async(ctx, ctxBody) => {
    console.log("-------------------- errs --------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    let {position="没有传递错误码[position]", err="没有传递错误值[err]"} = ctxBody;
    console.error("[@/resJson errs] position: ", position);
    console.error("[@/resJson errs] err: ", err);
    console.log();
    err = String(err);
    ctx.status = 500;
    ctx.body = {status: 500, ...ctxBody};
    return;
}