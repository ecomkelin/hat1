const moment = require('moment');
const success = async(ctx, ctxBody) => {
    console.log("-----------------------------------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));

    const {position, message} = ctxBody;
    console.log("[@/resJson success] positon: ", positon);
    console.log("[@/resJson success] message: ", message);
    console.log();
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
    return;
}
const failure = async(ctx, ctxBody) => {
    console.log("-----------------------------------------------");
    console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    const {position, message} = ctxBody;

    console.log("[@/resJson failure] position: ", position);
    console.log("[@/resJson failure] message: ", message);
    console.log();

    ctx.status = 400;
    ctx.body = {status: 400, ...ctxBody};
    return;
}

const errs = async(ctx, ctxBody) => {
    console.log("-----------------------------------------------");
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

module.exports = {
    success, failure, errs
}