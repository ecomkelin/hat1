const moment = require('moment');
module.exports = () => async(ctx, next) => {
    try {
        let start = Date.now();
        console.log(moment(start).format("YYYY-MM-DD HH:mm:ss"));
    
        console.info(`[ ${ctx.method} ] ${ctx.url}`)
        // if(ctx && ctx.request) console.debug("req body: ", ctx.request.body);
        // if(ctx.request.headers) console.debug(ctx.request.headers.authorization)
        await next();
    
        let person = '< ';
        let payload = ctx.request.payload;
        if(payload) {
            let {Firm, code, name, type} = payload;
            if(Firm) person += `[${Firm}]Firm `;
            if(code) person += `[${code}]code `;
            if(name) person += `[${name}]name `;
            if(type) person += `[${type}]type `;
        }
        person += '>';
        // if(ctx) console.debug("res body", ctx.body);
        let end = Date.now();
        let ms = end - start;
        console.info(ctx.status, person, `用时: ${ms}ms`);
        console.info();
        return;
    } catch(e) {
        console.error("[errs] e.stack: ", e.stack);
    }
}