/* ======================================== response ======================================== */
/**
 * 数组里的 元素是否全为 ObjectId
 * @param {Object} ctx: 要排序的数组
 * @param {Object} api: 要排序的数组
* returns [Boolean]
 */
resAPI = (ctx, api, next) => {
    ctx.status = 200;
    ctx.body = { status: 200, api };

    if (next) next();
}


resNOACCESS = (ctx, next) => {
    ctx.status = 401;
    ctx.body = { status: 401, errMsg: `您没有访问 [${ctx.url}] 的权限` };

    if (next) next();
}


resSUCCESS = (ctx, ctxBody, next) => {
    ctx.status = 201;
    ctx.body = { status: 201, ...ctxBody };

    if (next) next();
}


resERR = (ctx, e, next) => {
    let errMsg = e.stack

    if (errMsg) {
        let status = e.status || 500;
        ctx.body = { status, errMsg };
        console.error("[errs] e.stack: ", errMsg);
    } else {
        let status = e.status || 400;
        ctx.body = { status, ...e };
        if (status === 500) console.error("[errs] e: ", e);
    }

    if (next) next();
}