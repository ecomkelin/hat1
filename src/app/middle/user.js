const stint_user = require('../../stint/user');
const {failure, errs} = require('../../resJson');

const register = async(ctx, next) => {
    const position = "@/app/middle/user.js register";
    try {
        const obj = ctx.request.body;
        const keys = Object.keys(stint_user);

        for(let i=0; i<keys.length; i++) {
            const key = keys[i];

            // 先判断是否可以为空
            if(stint_user[key].required === true) {
                if(obj[key] === null || obj[key] === undefined) {
                    const message = stint_user[key].errMsg.nullMsg;
                    return failure(ctx, {position, message});
                }
            } else {
                if(obj[key] === null || obj[key] === undefined) continue;
            }

            if(stint_user[key].trim && stint_user[key].trim !== obj[key].length) {
                const message = stint_user[key].errMsg.trimMsg+stint_user[key].trim;
                return failure(ctx, {position, message});
            }

            if(stint_user[key].min && stint_user[key].min > obj[key].length) {
                const message = stint_user[key].errMsg.minMsg+stint_user[key].min;
                return failure(ctx, {position, message});
            }

            if(stint_user[key].max &&  stint_user[key].max < obj[key].length) {
                const message = stint_user[key].errMsg.maxMsg+stint_user[key].max;
                return failure(ctx, {position, message});
            }

            if(stint_user[key].regexp) {
                const regexp = new RegExp(stint_user[key].regexp);
                if(!regexp.test(obj[key])) {
                    const message = stint_user[key].errMsg.regexpMsg;
                    return failure(ctx, {position, message});
                }
            }
        }

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
    
}

module.exports = {
    register,
}