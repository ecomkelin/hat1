exports.api = async(ctx, api, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, api};
}

exports.success = async(ctx, ctxBody, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
}

exports.errs = async(ctx, e, next) => {
    let error = e.stack
    let status = e.status || 500;
    ctx.status = status;

    if(error) {
        ctx.body = {status, error};
        if(status === 500) console.error("[errs] e.stack: ", error);
    } else {
        ctx.body = {status, ...e};
        if(status === 500) console.error("[errs] e: ", e);
    }
}
