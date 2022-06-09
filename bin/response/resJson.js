const moment = require('moment');

exports.all = async(ctx, ctxBody) => {
    console.log("--------------------- resJson all ---------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    if(ctxBody.message) console.log("[@/resJson success] message: ", ctxBody.message);
    console.log();
    ctx.status = ctxBody.status;
    ctx.body = {...ctxBody};
    return;
}
exports.success = async(ctx, ctxBody) => {
    console.log("----------------- resJson success -----------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    if(ctxBody.message) console.log("[@/resJson success] message: ", ctxBody.message);
    console.log();
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
    return;
}
exports.failure = async(ctx, ctxBody) => {
    console.log("----------------- resJson failure -----------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    
    if(ctxBody.message) console.log("[@/resJson failure] message: ", ctxBody.message);
    console.log();
    
    ctx.status = 400;
    ctx.body = {status: 400, ...ctxBody};
    return;
}

exports.errs = async(ctx, ctxBody) => {
    console.log("-------------------- resJson errs --------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    let {err} = ctxBody
    if(err) err = err.message;
    console.error("[@/resJson errs] err: ", err);
    console.log();
    err = String(err);
    ctx.status = 500;
    ctx.body = {status: 500, ...ctxBody};
    return;
}