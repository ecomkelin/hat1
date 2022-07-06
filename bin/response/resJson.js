exports.api = async(ctx, api, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, api};
}

exports.success = async(ctx, ctxBody, next) => {
    if(ctxBody.message) console.log("[success] message: ", ctxBody.message);
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
}

exports.errs = async(ctx, e, next) => {
    let error = e.stack
    let status = e.status || 500;
    ctx.status = status;

    if(error) {
        ctx.body = {status, error};
        console.log("[errs] e.stack: ", error);
    } else {
        ctx.body = {status, ...e};
        console.log("[errs] e: ", e);
    }
}