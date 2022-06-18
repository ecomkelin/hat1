const moment = require('moment');

exports.api = async(ctx, api) => {
    console.log("--------------------- resJson api ---------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    console.log();
    ctx.status = 200;
    ctx.body = api;
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

exports.errs = async(ctx, e) => {
    console.log("-------------------- resJson errs --------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    let error = e.stack
    let status = e.status || 500;
    ctx.status = status;

    if(error) {
        ctx.body = {status, error};
        console.log("[@/resJson errs] e.stack: ", error);
    } else {
        ctx.body = {status, ...e};
        console.log("[@/resJson errs] e: ", e);
    }

    console.log();
    return;
}