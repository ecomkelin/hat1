const success = async(ctx, ctxBody) => {
    // console.log("[@/resJson success] data: ", ctxBody.data);
    const {message} = ctxBody;
    // console.log("[@/resJson success] position: ", position);
    console.log("[@/resJson success] message: ", message);
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
    return;
}
const failure = async(ctx, ctxBody) => {
    const {position, message} = ctxBody;
    if(!position) {
        ctx.status = 500,
        ctx.body = {status: 500, position: "没有传递错误码[position]"};
        return;
    }

    console.log("[@/resJson failure] position: ", position);
    console.log("[@/resJson failure] message: ", message);
    ctx.status = 400;
    ctx.body = {status: 400, ...ctxBody};
    return;
}

const errs = async(ctx, ctxBody) => {
    let {position="没有传递错误码[position]", err="没有传递错误值[err]"} = ctxBody;
    console.error("[@/resJson errs] position: ", position);
    console.error("[@/resJson errs] err: ", err);
    err = String(err);
    ctx.status = 500;
    ctx.body = {status: 500, position, err};
    return;
}

module.exports = {
    success, failure, errs
}