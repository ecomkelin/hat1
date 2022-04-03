const stint_User = require('../../stint/User');
const {failure, errs} = require('../../resJson');

const create = async(ctx, next) => {
    const position = "@/app/middle/User.js create";
    try {
        const body = ctx.request.body;
        const keys = Object.keys(stint_User);

        for(let i=0; i<keys.length; i++) {
            const key = keys[i];

            // 先判断是否可以为空
            if(stint_User[key].required === true) {
                if(body[key] === null || body[key] === undefined) {
                    const message = stint_User[key].errMsg.nullMsg;
                    return failure(ctx, {position, message});
                }
            } else {
                if(body[key] === null || body[key] === undefined) continue;
            }

            if(stint_User[key].trim && stint_User[key].trim !== body[key].length) {
                const message = stint_User[key].errMsg.trimMsg+stint_User[key].trim;
                return failure(ctx, {position, message});
            }

            if(stint_User[key].min && stint_User[key].min > body[key].length) {
                const message = stint_User[key].errMsg.minMsg+stint_User[key].min;
                return failure(ctx, {position, message});
            }

            if(stint_User[key].max &&  stint_User[key].max < body[key].length) {
                const message = stint_User[key].errMsg.maxMsg+stint_User[key].max;
                return failure(ctx, {position, message});
            }

            if(stint_User[key].regexp) {
                const regexp = new RegExp(stint_User[key].regexp);
                if(!regexp.test(body[key])) {
                    const message = stint_User[key].errMsg.regexpMsg;
                    return failure(ctx, {position, message});
                }
            }
        }

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
    
}

const list = async(ctx, next) => {
    const position = "@/app/middle/User.js list";
    try {
        const body = ctx.request.body;
        const {filter={}, projectObj={}, skipInt, limitInt, sortObj={}, populate} = body;
        const {match, fuzzy, includes, excludes, at_before, at_after, gte, lte} = filter;
        body.matchObj = {...match};
        if(fuzzy) {

        } 
        if(skipInt !== undefined) {
            if(isNaN(skipInt)) {    // 还有其他判断
                const message = "您的 [skipInt] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }
        if(limitInt !== undefined) {
            if(isNaN(limitInt)) {    // 还有其他判断
                const message = "您的 [limitInt] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }
        for(key in projectObj) {
            if(projectObj[key] != 1 || projectObj[key] != 0) {
                projectObj[key] = "$"+projectObj[key];
            }
        }
        for(key in sortObj) {
            if(sortObj[key] != 1 || sortObj[key] != -1) {
                const message = "您的 [sortObj] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }
        if(populate) {
            if((typeof populate) === 'string') {

            } else if(populate instanceof Array) {
                
            } else if(populate instanceof Object) {

            } else {
                const message = "您的 [populate] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }
        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
    
}

module.exports = {
    create, list
}