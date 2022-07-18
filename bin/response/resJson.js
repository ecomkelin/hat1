exports.api = (ctx, api, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, api};
}

exports.success = (ctx, ctxBody, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
}
exports.noAccess = (ctx) => {
    ctx.status = 401;
    ctx.body = {status: 401, message: `您没有访问 [${ctx.url}] 的权限`}
}
exports.errs = (ctx, e, next) => {
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
