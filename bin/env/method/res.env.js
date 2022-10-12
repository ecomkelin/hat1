/* ======================================== response ======================================== */

resAPI = (ctx, api, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, api};
}


resNOACCESS = (ctx) => {
    ctx.status = 401;
    ctx.body = {status: 401, errMsg: `您没有访问 [${ctx.url}] 的权限`}
}


resSUCCESS = (ctx, ctxBody, next) => {
    ctx.status = 200;
    ctx.body = {status: 200, ...ctxBody};
}


resERR = (ctx, e, next) => {
    let errMsg = e.stack

    if(errMsg) {
        let status = e.status || 500;
        ctx.body = {status, errMsg};
        console.error("[errs] e.stack: ", errMsg);
    } else {
        let status = e.status || 400;
        ctx.body = {status, ...e};
        if(status === 500) console.error("[errs] e: ", e);
    }
}